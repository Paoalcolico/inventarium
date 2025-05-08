import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro.component.html'
})
export class CadastroProdutoComponent {
  nome: string = '';
  marca: string = '';
  quantidade: number = 0;
  valorUnitario: number = 0;

  produtos: any[] = [];

  cadastrarProduto() {
    if (this.nome && this.marca && this.quantidade > 0 && this.valorUnitario > 0) {
      const novoProduto = {
        nome: this.nome,
        marca: this.marca,
        quantidade: this.quantidade,
        valorUnitario: this.valorUnitario,
        valorTotal: this.quantidade * this.valorUnitario
      };

      this.produtos.push(novoProduto);
      this.limparCampos();
    } else {
      alert('Preencha todos os campos corretamente!');
    }
  }

  limparCampos() {
    this.nome = '';
    this.marca = '';
    this.quantidade = 0;
    this.valorUnitario = 0;
  }

  // Função para remover um produto
  removerProduto(produto: any) {
    this.produtos = this.produtos.filter((p: any) => p !== produto);
  }
}
