import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoService, Produto } from '../services/produto-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './produto-detalhe.component.html'
})
export class ProdutoDetalheComponent {
  produto: Produto | null = null;
  index: number = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService
  ) {
    this.index = Number(this.route.snapshot.paramMap.get('index'));
    const produtos = this.produtoService.getProdutos();
    if (this.index >= 0 && this.index < produtos.length) {
      this.produto = { ...produtos[this.index] };
    }
  }

  salvar() {
    if (this.produto) {
      this.produtoService.atualizarProduto(this.index, this.produto);
      alert('Produto atualizado com sucesso!');
      this.router.navigate(['/lista']);
    }
  }

  excluir() {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.removerProduto(this.index);
      this.router.navigate(['/lista']);
    }
  }

  cancelar() {
    this.router.navigate(['/lista']);
  }
}
