import { Routes } from '@angular/router';
import { authRedirectGuard } from './shared/guard/auth-redirect-guard';
import { authGuard } from './shared/guard/auth-guard';

export const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./features/homepage/homepage').then((m) => m.Homepage),
    title: 'PUPAI',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
    title: 'PUPAI: Login',
    canActivate: [authRedirectGuard],
  },
  {
    path: 'signup',
    canActivate: [authRedirectGuard],
    loadComponent: () =>
      import('./features/signup/signup').then((m) => m.Signup),
    title: 'PUPAI: Sign up',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'PUPAI: Dashboard',
  },
  {
    path: 'recording',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/recording/recording').then((m) => m.Recording),
    title: 'PUPAI: Record',
  },
  {
    path: 'reports/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/report/report').then((m) => m.Report),
    title: 'PUPAI: Report',
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin-dashboard/admin-dashboard').then(
        (m) => m.AdminDashboard
      ),
    title: 'PUPAI: Admin',
  },
  { path: '**', redirectTo: '' },
];
