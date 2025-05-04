import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {authGuard} from './auth/auth.guard';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {HouseDetailComponent} from './components/house-detail/house-detail.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: HouseDetailComponent, canActivate: [authGuard] },
  // { path: 'update/:id', component: HouseDetailComponent, canActivate: [authGuard] },
  { path: 'detail/:id', component: HouseDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
