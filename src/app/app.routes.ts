// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { CadastroProdutoComponent } from './cadastro/cadastro.component';
import { ListaComponent } from './lista/lista.component';
import { TransacaoComponent } from './transacao/transacao.component';
import { ProdutoDetalheComponent } from './produto-detalhe/produto-detalhe.component';
import { HistoricoTransacaoComponent } from './historico-transacao/historico-transacao.component';

export const routes: Routes = [
  { path: '', component: ListaComponent },
  { path: 'cadastro', component: CadastroProdutoComponent },
  { path: 'transacao', component: TransacaoComponent },
  { path: 'produto/:index', component: ProdutoDetalheComponent },
  { path: 'historico', component: HistoricoTransacaoComponent }
];
