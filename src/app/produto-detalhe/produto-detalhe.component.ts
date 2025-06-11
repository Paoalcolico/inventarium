import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService, Produto } from '../services/produto-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produto-detalhe.component.html',
  styleUrls: ['./produto-detalhe.component.css']
})
export class ProdutoDetalheComponent {
  produto: Produto | null = null;
  index: number = -1;
  modoEdicao = false;  // controla se os campos estão em modo edição

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

  editar() {
    this.modoEdicao = true;  // ativa modo edição quando clicar no botão "Editar"
  }

  salvar() {
    if (this.produto) {
      this.produtoService.atualizarProduto(this.index, this.produto);
      alert('Produto atualizado com sucesso!');
      this.modoEdicao = false; // volta para modo visualização após salvar
      this.router.navigate(['/lista']);
    }
  }

  voltar() {
    if (this.modoEdicao) {
      // Se estiver editando, cancela edição e volta para modo visualização
      this.modoEdicao = false;
    } else {
      // Se não estiver editando, volta para lista
      this.router.navigate(['/']);
    }
  }
}
