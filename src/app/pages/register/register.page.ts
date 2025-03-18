import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    if (!this.email || !this.password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await this.authService.register(this.email, this.password);
      if (userCredential?.user) { 
        alert('Registration successful! Please log in.');
        this.router.navigate(['/login']); 
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert(error.message);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }
}
