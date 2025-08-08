import { Component, signal } from '@angular/core';
import { Router, RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
   styleUrls: ['./menu.css'],
  templateUrl: './menu.html',
})
export class MenuComponent {
  isMenuOpen = signal(false);
  
  constructor(private router: Router) { }

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
}
