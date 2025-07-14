import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/shell/home-shell.module').then(
      m => m.HomeShellModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./auth/shell/auth-shell.module').then(
      m => m.AuthShellModule)
  },
];
