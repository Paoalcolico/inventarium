// src/app/services/produto-service.ts
import { Injectable } from '@angular/core';

export interface Produto {
  codigoFabricante: string;
  marca: string;
  localizacao: string;
  garantiaMeses: number;
  nome: string;
  descricao: string;
  valorUnitario: number;
  quantidade: number;
}

export interface Transacao {
  produto: Produto;
  quantidade: number;
  data: string;
  tipo: 'entrada' | 'saida';
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private produtos: Produto[] = [];
  private transacoes: Transacao[] = [];

  getProdutos() {
    return this.produtos;
  }

  adicionarProduto(produto: Produto) {
    this.produtos.push(produto);
  }

  removerProduto(index: number) {
    this.produtos.splice(index, 1);
  }

  atualizarProduto(index: number, produtoAtualizado: Produto) {
    this.produtos[index] = produtoAtualizado;
  }

  entradaEstoque(codigoFabricante: string, quantidade: number, data: string): boolean {
    const produto = this.produtos.find(p => p.codigoFabricante === codigoFabricante);
    if (!produto || quantidade <= 0) return false;
    produto.quantidade += quantidade;
    this.transacoes.push({ produto, quantidade, data, tipo: 'entrada' });
    return true;
  }

  saidaEstoque(codigoFabricante: string, quantidade: number, data: string): boolean {
    const produto = this.produtos.find(p => p.codigoFabricante === codigoFabricante);
    if (!produto || quantidade <= 0 || produto.quantidade < quantidade) return false;
    produto.quantidade -= quantidade;
    this.transacoes.push({ produto, quantidade, data, tipo: 'saida' });
    return true;
  }

  getTransacoes() {
    return this.transacoes;
  }
}
