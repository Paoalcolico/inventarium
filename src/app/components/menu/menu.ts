import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
   styleUrls: ['./menu.css'],
  templateUrl: './menu.html',
})
export class MenuComponent implements OnInit {
  isMenuOpen = signal(false);
  currentUser: User | null = null;
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(
      user => this.currentUser = user
    );
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
    this.isMenuOpen.set(false);
  }

  navigateToRegistration() {
    this.router.navigate(['/product-registration']);
    this.isMenuOpen.set(false);
  }

  navigateToTransaction() {
    this.router.navigate(['/transaction']);
    this.isMenuOpen.set(false);
  }

  navigateToTransactions() {
    this.router.navigate(['/transactions']);
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen.set(false);
  }

  canAccessRegistration(): boolean {
    return this.currentUser?.role === 'Admin' || 
           this.currentUser?.role === 'Gerente' || 
           this.currentUser?.role === 'Supervisor';
  }
}
