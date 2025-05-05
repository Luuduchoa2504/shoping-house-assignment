import { Component, effect, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = signal(this.authService.isLoggedIn());
  accountLabel = computed(() => {
    const userInfo = this.authService.userInfo();
    return userInfo && userInfo.username ? userInfo.username : 'Account';
  });


  constructor() {
    effect(() => {
      const loggedIn = this.authService.isLoggedIn();
      this.isLoggedIn.set(loggedIn);
    });
  }

  logout() {
    this.authService.clearUserInfo();
  }


  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
