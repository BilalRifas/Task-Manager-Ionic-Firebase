import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    if (!this.email || !this.password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await this.authService.login(this.email, this.password);
      if (userCredential?.user) { 
        this.router.navigate(['/tasks']);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }
}
