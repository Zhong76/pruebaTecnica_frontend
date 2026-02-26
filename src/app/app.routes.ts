import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'model/:mode',
        loadComponent: () =>
            import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent),
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'user-list',
        loadComponent: () =>
            import('./features/users/pages/user-list/user-list.component').then(m => m.UserListComponent),
    },
    { path: '**', redirectTo: 'login' }
];