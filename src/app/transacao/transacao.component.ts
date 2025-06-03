// src/app/transacao/transacao.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService, Produto } from '../services/produto-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './transacao.component.html'
})
export class TransacaoComponent {
  produtos: Produto[] = [];
  produtoSelecionado: Produto | null = null;
  quantidade: number = 0;
  data: string = '';
  tipoTransacao: string = '';

  constructor(private produtoService: ProdutoService) {
    this.produtos = this.produtoService.getProdutos();
  }

  salvar() {
    if (this.produtoSelecionado && this.quantidade > 0 && this.data && this.tipoTransacao) {
      const codigo = this.produtoSelecionado.codigoFabricante;

      let sucesso = false;
      if (this.tipoTransacao === 'entrada') {
        sucesso = this.produtoService.entradaEstoque(codigo, this.quantidade, this.data);
      } else if (this.tipoTransacao === 'saida') {
        sucesso = this.produtoService.saidaEstoque(codigo, this.quantidade, this.data);
        if (!sucesso) {
          alert('Quantidade insuficiente no estoque para saída.');
          return;
        }
      }

      if (sucesso) {
        alert('Transação salva com sucesso!');
        this.limparFormulario();
      } else {
        alert('Erro ao atualizar o estoque.');
      }
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  cancelar() {
    this.limparFormulario();
  }

  private limparFormulario() {
    this.produtoSelecionado = null;
    this.quantidade = 0;
    this.data = '';
    this.tipoTransacao = '';
  }
}
