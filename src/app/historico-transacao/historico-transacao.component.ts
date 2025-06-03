import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService, Transacao } from '../services/produto-service';

@Component({
  selector: 'app-historico-transacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historico-transacao.component.html'
})
export class HistoricoTransacaoComponent {
  transacoes: Transacao[] = [];

  constructor(private produtoService: ProdutoService) {
    this.transacoes = this.produtoService.getTransacoes();
  }
}
