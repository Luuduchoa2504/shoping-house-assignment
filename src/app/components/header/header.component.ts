import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import {LoginService} from '../../services/login/login.service'; // Adjust path as needed

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  accountLabel: string = 'Account';
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in via localStorage or authService
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.isLoggedIn = true;
      this.accountLabel = JSON.parse(userInfo).username || 'Account';
    } else {
      this.authService.getUserInfo().subscribe((userInfo) => {
        if (userInfo && userInfo.username) {
          this.accountLabel = userInfo.username;
          this.isLoggedIn = true;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
      });
    }
  }

  logout() {
    this.loginService.logout();
    localStorage.removeItem('userInfo');
    this.isLoggedIn = false;
    this.accountLabel = 'Account';
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // navigateToSignup() {
  //   this.router.navigate(['/signup']);
  // }
}
