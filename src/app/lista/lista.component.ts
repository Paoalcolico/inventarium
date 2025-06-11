import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../services/produto-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent {
  filtro: string = '';

  constructor(public produtoService: ProdutoService, private router: Router) {}

  detalharProduto(index: number) {
    this.router.navigate(['/produto', index]);
  }

  get produtosFiltrados() {
    return this.produtoService.getProdutos().filter(produto =>
      produto.nome.toLowerCase().includes(this.filtro.toLowerCase()) ||
      produto.marca.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
}
