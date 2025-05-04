import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { LoginService } from '../../services/login/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  accountLabel: string = 'Account';
  isLoggedIn: boolean = false;
  private userInfoSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userInfoSubscription = this.authService.getUserInfo().subscribe((userInfo) => {
      if (userInfo && userInfo.username) {
        this.isLoggedIn = true;
        this.accountLabel = userInfo.username;
      } else {
        this.isLoggedIn = false;
        this.accountLabel = 'Account';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
