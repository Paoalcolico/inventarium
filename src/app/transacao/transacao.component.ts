import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService, Produto } from '../services/produto-service';
import { RouterLink } from '@angular/router';

interface ItemTransacao {
  produto: Produto;
  quantidade: number;
}

@Component({
  selector: 'app-transacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './transacao.component.html',
  styleUrls: ['./transacao.component.css']
})
export class TransacaoComponent {
  produtos: Produto[] = [];
  
  // Para adicionar novo item na tabela
  produtoSelecionado: Produto | null = null;
  quantidade: number = 1;

  // Lista de itens já adicionados na transação
  itensTransacao: ItemTransacao[] = [];

  data: string = '';
  tipoTransacao: string = '';

  constructor(private produtoService: ProdutoService) {
    this.produtos = this.produtoService.getProdutos();
  }

  adicionarItem() {
    if (!this.produtoSelecionado) {
      alert('Selecione um produto!');
      return;
    }
    if (this.quantidade <= 0) {
      alert('Quantidade deve ser maior que zero!');
      return;
    }
    // Verifica se produto já existe na lista (para somar quantidade)
    const itemExistente = this.itensTransacao.find(
      i => i.produto.codigoFabricante === this.produtoSelecionado!.codigoFabricante
    );
    if (itemExistente) {
      itemExistente.quantidade += this.quantidade;
    } else {
      this.itensTransacao.push({
        produto: this.produtoSelecionado,
        quantidade: this.quantidade
      });
    }
    // Reseta seleção
    this.produtoSelecionado = null;
    this.quantidade = 1;
  }

  removerItem(index: number) {
    this.itensTransacao.splice(index, 1);
  }

  getValorTotalItem(item: ItemTransacao): number {
    return item.produto.valorUnitario * item.quantidade;
  }

  getValorTotalTransacao(): number {
    return this.itensTransacao.reduce(
      (acc, item) => acc + this.getValorTotalItem(item),
      0
    );
  }

  salvar() {
    if (this.itensTransacao.length === 0) {
      alert('Adicione pelo menos um item à transação.');
      return;
    }
    if (!this.data || !this.tipoTransacao) {
      alert('Preencha data e tipo da transação.');
      return;
    }

    let sucesso = true;
    for (const item of this.itensTransacao) {
      const codigo = item.produto.codigoFabricante;
      if (this.tipoTransacao === 'entrada') {
        sucesso = this.produtoService.entradaEstoque(codigo, item.quantidade, this.data);
      } else if (this.tipoTransacao === 'saida') {
        sucesso = this.produtoService.saidaEstoque(codigo, item.quantidade, this.data);
        if (!sucesso) {
          alert(`Quantidade insuficiente no estoque para saída do produto ${item.produto.nome}.`);
          return;
        }
      }
      if (!sucesso) break;
    }

    if (sucesso) {
      alert('Transação salva com sucesso!');
      this.limparFormulario();
    } else {
      alert('Erro ao atualizar o estoque.');
    }
  }

  cancelar() {
    this.limparFormulario();
  }

  private limparFormulario() {
    this.itensTransacao = [];
    this.produtoSelecionado = null;
    this.quantidade = 1;
    this.data = '';
    this.tipoTransacao = '';
  }
}
