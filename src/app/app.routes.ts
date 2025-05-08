import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastroProdutoComponent } from './cadastro/cadastro.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'cadastro',
        component: CadastroProdutoComponent
    }
];
