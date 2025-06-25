import { Component } from '@angular/core';
import { Router, RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
})
export class MenuComponent {
  
  constructor(private router: Router) { }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }

  navigateToRegistration() {
    this.router.navigate(['/product-registration']);
  }

  navigateToTransaction() {
    this.router.navigate(['/transaction']);
  }

  navigateToTransactions() {
    this.router.navigate(['/transactions']);
  }
}
