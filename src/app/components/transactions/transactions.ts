import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class TransactionsComponent implements OnInit {
  // ...existing code...

  getTotalEntradas(): number {
    return this.transactions().filter(t => t.type === 'ENTRADA').length;
  }

  getTotalSaidas(): number {
    return this.transactions().filter(t => t.type === 'SAIDA').length;
  }
  filterType = signal<'all' | 'ENTRADA' | 'SAIDA'>('all'); // MAIÚSCULO
  searchTerm = signal('');
  transactions = signal<Transaction[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  filteredTransactions = computed(() => {
    let filtered = this.transactions();

    if (this.filterType() !== 'all') {
      filtered = filtered.filter(t => t.type === this.filterType());
    }

    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  totalTransactions = computed(() => this.filteredTransactions().length);
  
  entryTransactions = computed(() => 
    this.filteredTransactions().filter(t => t.type === 'ENTRADA')
  );

  exitTransactions = computed(() => 
    this.filteredTransactions().filter(t => t.type === 'SAIDA')
  );

  totalEntryValue = computed(() =>
    this.entryTransactions().reduce((sum, t) => sum + t.totalValue, 0)
  );

  totalExitValue = computed(() =>
    this.exitTransactions().reduce((sum, t) => sum + t.totalValue, 0)
  );

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar transações:', error);
        this.errorMessage.set('Erro ao carregar transações');
        this.loading.set(false);
      }
    });
  }

  setFilterType(type: 'all' | 'ENTRADA' | 'SAIDA') {
    this.filterType.set(type);
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goToNewTransaction() {
    this.router.navigate(['/transaction']);
  }
}