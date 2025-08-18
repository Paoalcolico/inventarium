import { Component, signal, computed, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { Marca } from '../../models/marca';
import { ProductService } from '../../services/product';
import { MarcaService } from '../../services/marca';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  selectedFilter = signal<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');

  filterBy(type: 'all' | 'inStock' | 'lowStock' | 'outOfStock') {
    this.selectedFilter.set(type);
    this.page.set(1);
  }

  get allProductsCount(): number {
    return this.products().length;
  }
  get inStockCount(): number {
    return this.products().filter(p => p.quantity > 5).length;
  }
  get lowStockCount(): number {
    return this.products().filter(p => p.quantity > 0 && p.quantity <= 5).length;
  }
  get outOfStockCount(): number {
    return this.products().filter(p => p.quantity === 0).length;
  }
  itemsPerPage = signal(25);
  orderBy = signal('name-asc');
  applyOrdering(): void {
    const sorted = [...this.products()];
    switch (this.orderBy()) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'brand-asc':
        sorted.sort((a, b) => String(a.brand ?? '').localeCompare(String(b.brand ?? '')));
        break;
      case 'brand-desc':
        sorted.sort((a, b) => String(b.brand ?? '').localeCompare(String(a.brand ?? '')));
        break;
      case 'status':
        sorted.sort((a, b) => this.getStockStatus(a.quantity).localeCompare(this.getStockStatus(b.quantity)));
        break;
    }
    this.products.set(sorted);
    this.page.set(1);
  }
  searchTerm = signal('');
  products = signal<Product[]>([]);
  loading = signal(false);

  // Paginação
  page = signal(1);

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let products = this.products();

    if (term) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.manufacturerCode.toLowerCase().includes(term)
      );
    }

    switch (this.selectedFilter()) {
      case 'inStock':
        return products.filter(p => p.quantity > 5);
      case 'lowStock':
        return products.filter(p => p.quantity > 0 && p.quantity <= 5);
      case 'outOfStock':
        return products.filter(p => p.quantity === 0);
      default:
        return products;
    }
  });

  paginatedProducts = computed(() => {
  const start = (this.page() - 1) * this.itemsPerPage();
  return this.filteredProducts().slice(start, start + this.itemsPerPage());
  });

  get totalPages(): number {
  return Math.ceil(this.filteredProducts().length / this.itemsPerPage());
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page.set(page);
    }
  }

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
  this.page.set(1);
    this.page.set(1); // Volta para a primeira página ao buscar
    if (term.trim()) {
      this.productService.searchProducts(term).subscribe({
        next: (products: Product[]) => {
          this.products.set(products);
          this.page.set(1);
        },
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

  // Stats methods
  getProductsInStock(): number {
    return this.filteredProducts().filter(p => p.quantity > 5).length;
  }

  getLowStockProducts(): number {
    return this.filteredProducts().filter(p => p.quantity > 0 && p.quantity <= 5).length;
  }

  getOutOfStockProducts(): number {
    return this.filteredProducts().filter(p => p.quantity === 0).length;
  }

  // Stock status methods
  getStockClass(quantity: number): string {
    if (quantity === 0) return 'text-error-600';
    if (quantity <= 5) return 'text-warning-600';
    return 'text-success-600';
  }

  getStockBadgeClass(quantity: number): string {
    if (quantity === 0) return 'badge-error';
    if (quantity <= 5) return 'badge-warning';
    return 'badge-success';
  }

  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'Sem Estoque';
    if (quantity <= 5) return 'Estoque Baixo';
    return 'Em Estoque';
  }
}
