import {Routes} from '@angular/router';
import {authGuard, guestGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout').then((m) => m.MainLayout),
    children: [
      {path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardPage)},
      {path: 'history', loadComponent: () => import('./pages/history/history').then((m) => m.HistoryPage)},
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
    ],
  },
  {path: '**', redirectTo: ''},
];
