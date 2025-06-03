import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService, Produto } from '../services/produto-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro-produto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro.component.html'
})
export class CadastroProdutoComponent {
  produto: Produto = {
    codigoFabricante: '',
    marca: '',
    localizacao: '',
    garantiaMeses: 0,
    nome: '',
    descricao: '',
    valorUnitario: 0,
    quantidade: 0
  };

  constructor(private produtoService: ProdutoService) {}

  adicionarProduto() {
    const camposValidos = 
      this.produto.codigoFabricante.trim() !== '' &&
      this.produto.nome.trim() !== '' &&
      this.produto.quantidade > 0 &&
      this.produto.valorUnitario > 0;

    if (!camposValidos) {
      alert('Preencha todos os campos obrigatórios corretamente! Código do fabricante, nome, quantidade e valor unitário são obrigatórios.');
      return;
    }

    this.produtoService.adicionarProduto({ ...this.produto });
    this.limparCampos();
  }

  limparCampos() {
    this.produto = {
      codigoFabricante: '',
      marca: '',
      localizacao: '',
      garantiaMeses: 0,
      nome: '',
      descricao: '',
      valorUnitario: 0,
      quantidade: 0
    };
  }
}
