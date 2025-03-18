import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
  onAuthStateChanged,
} from '@angular/fire/auth';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  async register(email: string, password: string): Promise<UserCredential | null> {
    try {
      await signOut(this.auth); 
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      this.currentUser = userCredential.user;
      return userCredential;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<UserCredential | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUser = userCredential.user;
      return userCredential;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.currentUser = null;
      this.router.navigate(['/login']); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
