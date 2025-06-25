import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './components/product-details/product-details';
import { ProductsComponent } from './components/products/products';
import { ProductRegistrationComponent } from './components/product-registration/product-registration';
import { TransactionComponent } from './components/transaction/transaction';
import { TransactionsComponent } from './components/transactions/transactions';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'product-registration', component: ProductRegistrationComponent },
  { path: 'transaction', component: TransactionComponent },
  { path: 'transactions', component: TransactionsComponent }
];
