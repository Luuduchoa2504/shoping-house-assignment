import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {authGuard} from './auth/auth.guard';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {HouseListingComponent} from './components/house-listing/house-listing.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: HouseListingComponent, canActivate: [authGuard] },
  { path: 'update/:id', component: HouseListingComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
