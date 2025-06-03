import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../services/produto-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista.component.html'
})
export class ListaComponent {
  constructor(public produtoService: ProdutoService, private router: Router) {}

  detalharProduto(index: number) {
    this.router.navigate(['/produto', index]);
  }
}
