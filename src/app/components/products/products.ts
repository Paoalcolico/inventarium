// src/app/components/products/products.component.ts

import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  searchTerm = signal('');
  products = signal<Product[]>([]);
  loading = signal(false);

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.products();
    }
    return this.products().filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.manufacturerCode.toLowerCase().includes(term)
    );
  });

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loading.set(false);
      }
    });
  }

  loadSortedProducts(): void {
    this.loading.set(true);
    this.productService.getSortedProductsByName().subscribe({
      next: (products: Product[]) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao ordenar produtos:', error);
        this.loading.set(false);
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);

    if (term.trim()) {
      this.productService.searchProducts(term).subscribe({
        next: (products: Product[]) => this.products.set(products),
        error: (error) => console.error('Erro na busca:', error)
      });
    } else {
      this.loadProducts();
    }
  }

  viewDetails(product: Product): void {
    this.router.navigate(['/product-details', product.id]);
  }

  goToRegistration(): void {
    this.router.navigate(['/product-registration']);
  }
}
