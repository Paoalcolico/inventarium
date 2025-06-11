import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importar FormsModule
import { ProdutoService, Transacao } from '../services/produto-service';

@Component({
  selector: 'app-historico-transacao',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Adicionar FormsModule aqui
  templateUrl: './historico-transacao.component.html',
  styleUrls: ['./historico-transacao.css']
})
export class HistoricoTransacaoComponent {
  filtro: string = '';
  transacoes: Transacao[] = [];

  constructor(private produtoService: ProdutoService) {
    this.transacoes = this.produtoService.getTransacoes();
  }

  // Filtro aplicado no array de transações
  get transacoesFiltradas(): Transacao[] {
    if (!this.filtro) {
      return this.transacoes;
    }
    const filtroLower = this.filtro.toLowerCase();
    return this.transacoes.filter(t =>
      t.produto.nome.toLowerCase().includes(filtroLower) ||
      t.produto.codigoFabricante.toLowerCase().includes(filtroLower)
    );
  }
}
