import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductDetailsComponent } from './components/product-details/product-details';
import { ProductsComponent } from './components/products/products';
import { ProductRegistrationComponent } from './components/product-registration/product-registration';
import { TransactionComponent } from './components/transaction/transaction';
import { TransactionsComponent } from './components/transactions/transactions';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Rotas protegidas
  { 
    path: 'products', 
    component: ProductsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'product-details/:id', 
    component: ProductDetailsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'product-registration', 
    component: ProductRegistrationComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'transaction', 
    component: TransactionComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'transactions', 
    component: TransactionsComponent,
    canActivate: [AuthGuard]
  },

  // Wildcard route
  { path: '**', redirectTo: '/login' }
];
