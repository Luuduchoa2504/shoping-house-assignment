import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../auth/data-access/login.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbAlertModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);
  private toastrService = inject(ToastrService);

  isLoggedIn = signal(this.authService.isLoggedIn());
  accountLabel = computed(() => {
    const userInfo = this.authService.userInfo();
    return userInfo && userInfo.username ? userInfo.username : 'Account';
  });

  loginForm!: FormGroup;
  error: string | null = null;

  constructor() {
    this.initForm();
    effect(() => {
      const loggedIn = this.authService.isLoggedIn();
      this.isLoggedIn.set(loggedIn);
    });
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.loginService.login(username, password).subscribe({
        next: (response) => {
          const token = response?.data?.attributes?.token;
          if (token) {
            this.error = null;
            this.toastrService.success('You are logged in as Administrator', 'Success');
            // No navigation needed; state updates reactively
          } else {
            this.error = 'No token received from server.';
          }
        },
        error: (err) => {
          this.error = 'Login failed. Check username and password or server status.';
        }
      });
    } else {
      this.error = 'Please fill in all required fields correctly';
      this.loginForm.markAllAsTouched();
    }
  }

  logout() {
    this.authService.clearUserInfo();
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
