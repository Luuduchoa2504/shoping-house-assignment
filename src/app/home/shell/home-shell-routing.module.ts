import {RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '',
    loadComponent: () => import('../feature/homepage/homepage.component').then(
      m => m.HomepageComponent)
    },
  { path: 'create',
    loadComponent: () => import('../feature/home-detail/home-detail.component').then(
      m => m.HomeDetailComponent
    )
  },
  { path: 'detail/:id',
    loadComponent: () => import('../feature/home-detail/home-detail.component').then(
      m => m.HomeDetailComponent
    )
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeShellRoutingModule {}
