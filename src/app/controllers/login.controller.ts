import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginCredentials, LoginResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginController {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async handleLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.authService.login(credentials).toPromise();
      
      if (response && response.success) {
        this.authService.setCurrentUser(response.username!, response.role!, response.token!);
        this.router.navigate(['/products']);
        return response;
      }
      
      return response || { success: false, message: 'Erro inesperado' };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: 'Erro de conexão com o servidor'
      };
    }
  }

  handleLogout(): void {
    this.authService.logout();
  }

  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}
