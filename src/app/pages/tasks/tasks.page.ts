import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TaskService, Task } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit, OnDestroy {
  tasks: Task[] = [];
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskDueDate: string = '';
  enableDueDate = false;

  selectedFile: File | null = null;

  loading = false;
  editingTaskId: string | null = null;
  editTitle = '';
  editDescription = '';
  editDueDate: string = '';
  editEnableDueDate = false;

  private currentUserId: string | null = null;
  currentUser: any;
  private userCheckInterval: any;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadTasks();

    this.userCheckInterval = setInterval(() => {
      const newUser = this.authService.getCurrentUser();
      if (newUser?.uid !== this.currentUserId) {
        this.currentUserId = newUser?.uid || null;
        this.loadTasks();
        this.loadCurrentUser();
      }
    }, 2000);
  }

  ngOnDestroy() {
    clearInterval(this.userCheckInterval);
  }

  loadCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
    this.currentUserId = this.currentUser?.uid || null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async loadTasks(event?: any) {
    if (!this.currentUserId) {
      console.error('User not authenticated');
      return;
    }

    this.loading = true;
    try {
      this.tasks = await this.taskService.getTasksByUserId(this.currentUserId);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      this.loading = false;
      if (event) event.target.complete();
    }
  }

  toggleDueDate() {
    if (!this.enableDueDate) {
      this.newTaskDueDate = '';
    }
  }

  toggleEditDueDate() {
    if (!this.editEnableDueDate) {
      this.editDueDate = '';
    }
  }

  async addTask() {
    if (!this.newTaskTitle.trim()) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    const newTask: Task = {
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      dueDate: this.enableDueDate ? this.newTaskDueDate : '',
      status: 'pending',
      userId: currentUser.uid,
      createdAt: Date.now(),
    };

    await this.taskService.addTask(newTask, this.selectedFile ?? undefined);

    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskDueDate = '';
    this.enableDueDate = false;
    this.selectedFile = null;

    this.loadTasks();
  }

  async markAsCompleted(task: Task) {
    if (task.id) {
      await this.taskService.updateTask(task.id, { status: 'completed' });
      this.loadTasks();
    }
  }

  async deleteTask(taskId: string) {
    await this.taskService.deleteTask(taskId);
    this.loadTasks();
  }

  handleRefresh(event: any) {
    this.loadTasks(event);
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  editTask(task: Task) {
    this.editingTaskId = task.id!;
    this.editTitle = task.title;
    this.editDescription = task.description;
    this.editDueDate = task.dueDate || '';
    this.editEnableDueDate = !!task.dueDate;
  }

  async saveTask(taskId: string) {
    if (!this.editTitle.trim()) return;

    const updatedTask: Partial<Task> = {
      title: this.editTitle,
      description: this.editDescription,
      dueDate: this.editEnableDueDate ? this.editDueDate : '',
    };

    await this.taskService.updateTask(taskId, updatedTask, this.selectedFile ?? undefined);

    this.cancelEdit();
    this.loadTasks();
  }

  onEditFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.editTitle = '';
    this.editDescription = '';
    this.editDueDate = '';
    this.editEnableDueDate = false;
  }
}
