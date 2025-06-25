import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-registration',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-registration.html',
  styleUrls: ['./product-registration.css']
})
export class ProductRegistrationComponent {
  newProduct = signal<Product>({
    manufacturerCode: '',
    brand: '',
    stockLocation: '',
    warrantyMonths: 12,
    name: '',
    description: '',
    unitPrice: 0,
    quantity: 0
  });

  isSubmitting = signal(false);
  errorMessage = signal('');

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  isFormValid(): boolean {
    const product = this.newProduct();
    return !!(
      product.manufacturerCode.trim() &&
      product.brand.trim() &&
      product.stockLocation.trim() &&
      product.name.trim() &&
      product.description.trim() &&
      product.unitPrice > 0 &&
      product.quantity >= 0 &&
      product.warrantyMonths >= 0
    );
  }

  saveProduct() {
    if (!this.isFormValid()) {
      this.errorMessage.set('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    
    this.productService.addProduct(this.newProduct()).subscribe({
      next: (savedProduct) => {
        console.log('Produto salvo com sucesso:', savedProduct);
        this.isSubmitting.set(false);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Erro ao salvar produto:', error);
        this.errorMessage.set(error.message || 'Erro ao registrar produto. Tente novamente.');
        this.isSubmitting.set(false);
      }
    });
  }

  resetForm() {
    this.newProduct.set({
      manufacturerCode: '',
      brand: '',
      stockLocation: '',
      warrantyMonths: 12,
      name: '',
      description: '',
      unitPrice: 0,
      quantity: 0
    });
    this.errorMessage.set('');
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}