import { Component, OnInit, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Product } from '../../models/product';
import { TransactionRequest } from '../../models/transaction';
import { ProductService } from '../../services/product';
import { TransactionService } from '../../services/transaction';

interface TransactionItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transaction.html',
  styleUrls: ['./transaction.css']
})
export class TransactionComponent implements OnInit {
  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  quantity = signal(1);
  transactionType = signal<'ENTRADA' | 'SAIDA' | ''>(''); // MAIÚSCULO
  transactionDate = signal(new Date().toISOString().split('T')[0]);
  transactionItems = signal<TransactionItem[]>([]);
  loading = signal(false);
  description = signal('');
  errorMessage = signal('');

  totalValue = computed(() => {
    return this.transactionItems().reduce((total, item) => 
      total + (item.product.unitPrice * item.quantity), 0
    );
  });

  isFormValid = computed(() => {
    return !!(
      this.transactionItems().length > 0 &&
      this.transactionType() &&
      this.transactionDate()
    );
  });

  constructor(
    private productService: ProductService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.errorMessage.set('Erro ao carregar produtos');
      }
    });
  }

  addItem() {
    const product = this.selectedProduct();
    const quantity = this.quantity();

    if (!product) {
      this.errorMessage.set('Selecione um produto.');
      return;
    }

    if (quantity <= 0) {
      this.errorMessage.set('Quantidade deve ser maior que zero.');
      return;
    }

    // Verificar estoque para saída
    if (this.transactionType() === 'SAIDA' && product.quantity < quantity) {
      this.errorMessage.set(`Estoque insuficiente. Disponível: ${product.quantity}`);
      return;
    }

    const currentItems = this.transactionItems();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      // Verificar novamente o estoque total
      if (this.transactionType() === 'SAIDA' && product.quantity < newQuantity) {
        this.errorMessage.set(`Estoque insuficiente. Disponível: ${product.quantity}`);
        return;
      }

      const updatedItems = currentItems.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: newQuantity }
          : item
      );
      this.transactionItems.set(updatedItems);
    } else {
      this.transactionItems.set([...currentItems, { product, quantity }]);
    }

    this.selectedProduct.set(null);
    this.quantity.set(1);
    this.errorMessage.set('');
  }

  removeItem(index: number) {
    const currentItems = this.transactionItems();
    const updatedItems = currentItems.filter((_, i) => i !== index);
    this.transactionItems.set(updatedItems);
  }

  getItemTotal(item: TransactionItem): number {
    return item.product.unitPrice * item.quantity;
  }

  saveTransaction() {
    if (!this.isFormValid()) {
      this.errorMessage.set('Adicione itens e preencha todos os campos obrigatórios.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    
    // Criar uma única transação com o valor total de todos os itens
    const transactionData: TransactionRequest = {
      type: this.transactionType() as 'ENTRADA' | 'SAIDA',
      totalValue: this.totalValue(),
      usuarioId: 1, // Por enquanto, usuário fixo
      description: this.description() || `Transação ${this.transactionType()} - ${this.transactionDate()}`
    };

    this.transactionService.addTransaction(transactionData).subscribe({
      next: (result) => {
        console.log('Transação processada com sucesso:', result);
        this.resetForm();
        this.loading.set(false);
        this.router.navigate(['/transactions']);
      },
      error: (error) => {
        console.error('Erro ao processar transação:', error);
        this.errorMessage.set(error.message || 'Erro ao processar transação');
        this.loading.set(false);
      }
    });
  }

  resetForm() {
    this.selectedProduct.set(null);
    this.quantity.set(1);
    this.transactionType.set('');
    this.transactionDate.set(new Date().toISOString().split('T')[0]);
    this.transactionItems.set([]);
    this.description.set('');
    this.errorMessage.set('');
  }

  goToTransactions() {
    this.router.navigate(['/transactions']);
  }
}