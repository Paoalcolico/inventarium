// src/app/components/products/products.component.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products',
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

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loading.set(false);
      }
    });
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
    
    // Se quiser usar a busca do backend:
    if (term.trim()) {
      this.productService.searchProducts(term).subscribe({
        next: (products) => this.products.set(products),
        error: (error) => console.error('Erro na busca:', error)
      });
    } else {
      this.loadProducts();
    }
  }

  viewDetails(product: Product) {
    this.router.navigate(['/product-details', product.id]);
  }

  goToRegistration() {
    this.router.navigate(['/product-registration']);
  }
}
