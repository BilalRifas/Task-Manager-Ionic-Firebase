import { Injectable } from '@angular/core';
import { 
  Firestore, collection, addDoc, doc, updateDoc, deleteDoc, 
  collectionData, query, where, getDocs 
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

export interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate?: string;
  status: 'pending' | 'completed';
  userId: string;
  createdAt: number;
  fileUrl?: string; 
  downloadURL?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksCollection = collection(this.firestore, 'tasks');
  private storage = getStorage(); 


  constructor(private firestore: Firestore, private auth: Auth) {}

  async getTasksByUserId(userId: string): Promise<Task[]> {
    const tasksRef = collection(this.firestore, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Task), 
    }));
  }

  async getTasks(): Promise<Task[]> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    return this.getTasksByUserId(user.uid);
  }

  async addTask(task: Task, file?: File): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    let fileUrl = '';
    if (file) {
      fileUrl = await this.uploadFile(file);
    }

    const taskWithUserId = { 
      ...task, 
      userId: user.uid, 
      fileUrl: fileUrl || null, 
      dueDate: task.dueDate || null, 
    };

    await addDoc(this.tasksCollection, taskWithUserId);
  }
  
  async updateTask(id: string, data: Partial<Task>, file?: File): Promise<void> {
    if (file) {
      data.fileUrl = await this.uploadFile(file);
    }

    const taskDocRef = doc(this.firestore, 'tasks', id);
    await updateDoc(taskDocRef, data);
  }

  deleteTask(id: string): Promise<void> {
    const taskDocRef = doc(this.firestore, 'tasks', id);
    return deleteDoc(taskDocRef);
  }

  async uploadFile(file: File): Promise<string> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }
  
    console.log("Uploading as user:", currentUser.uid); 
  
    const filePath = `tasks/${currentUser.uid}/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, filePath);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
  
    console.log("File uploaded successfully:", downloadURL);
    return downloadURL;
  }


}
