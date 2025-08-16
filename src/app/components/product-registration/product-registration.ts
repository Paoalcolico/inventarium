import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { Marca } from '../../models/marca';
import { ProductService } from '../../services/product';
import { MarcaService } from '../../services/marca';

@Component({
  selector: 'app-product-registration',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-registration.html',
  styleUrls: ['./product-registration.css']
})
export class ProductRegistrationComponent implements OnInit {
  newProduct = signal<Product>({
    manufacturerCode: '',
    brand: 1, // Agora é number, padrão 1
    stockLocation: '',
    warrantyMonths: 12,
    name: '',
    description: '',
    unitPrice: 0,
    quantity: 0
  });

  marcas = signal<Marca[]>([]);
  isSubmitting = signal(false);
  errorMessage = signal('');

  constructor(
    private productService: ProductService,
    private marcaService: MarcaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadMarcas();
  }

  loadMarcas() {
    this.marcaService.getMarcas().subscribe({
      next: (marcas) => {
        this.marcas.set(marcas);
      },
      error: (error) => {
        console.error('Erro ao carregar marcas:', error);
      }
    });
  }

  isFormValid(): boolean {
    const product = this.newProduct();
    return !!(
      product.manufacturerCode.trim() &&
      product.brand > 0 && // Agora verifica se é maior que 0
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
      brand: 1, // Agora é number
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