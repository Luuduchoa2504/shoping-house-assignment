import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

const routes: Routes = [
  { path: 'login',
    loadComponent: () => import('../feature/login-form/login-form.component').then(
      m => m.LoginFormComponent),
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthShellRoutingModule {}
