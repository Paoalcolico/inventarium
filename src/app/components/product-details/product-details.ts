// src/app/components/product-details/product-details.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  editableProduct: Product | null = null;
  isEditing = signal(false);
  loading = signal(false);
  originalProduct: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set({ ...product });
        this.editableProduct = { ...product };
        this.originalProduct = { ...product };
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        this.loading.set(false);
        this.router.navigate(['/products']);
      }
    });
  }

  enableEdit() {
    this.editableProduct = { ...this.product()! };
    this.isEditing.set(true);
  }

  cancelEdit() {
    if (this.originalProduct) {
      this.editableProduct = { ...this.originalProduct };
    }
    this.isEditing.set(false);
  }

  saveProduct() {
    if (this.editableProduct && this.editableProduct.id) {
      this.loading.set(true);
      this.productService.updateProduct(this.editableProduct.id, this.editableProduct).subscribe({
        next: (updatedProduct) => {
          this.product.set(updatedProduct);
          this.editableProduct = { ...updatedProduct };
          this.originalProduct = { ...updatedProduct };
          this.isEditing.set(false);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Erro ao atualizar produto:', error);
          alert('Erro ao atualizar produto: ' + (error.message || error));
          this.loading.set(false);
        }
      });
    } else {
      alert('Erro: produto não encontrado para edição');
    }
  }

  deleteProduct() {
    const currentProduct = this.product();
    if (currentProduct && currentProduct.id && confirm('Tem certeza que deseja deletar este produto?')) {
      this.loading.set(true);
      this.productService.deleteProduct(currentProduct.id).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Erro ao deletar produto:', error);
          alert('Erro ao deletar produto');
          this.loading.set(false);
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
