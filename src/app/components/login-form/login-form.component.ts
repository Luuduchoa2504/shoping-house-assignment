import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgbAlertModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  error: string | null = null;
  loginForm!: FormGroup;
  isSignUp = false; // Toggle between login and sign-up modes
  returnUrl: string = '/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''] // Only required for sign-up
    });
    this.updateValidators();
  }

  updateValidators() {
    const passwordControl = this.loginForm.get('password');
    const confirmPasswordControl = this.loginForm.get('confirmPassword');

    if (this.isSignUp) {
      confirmPasswordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      this.loginForm.setValidators([this.passwordMatchValidator]);
    } else {
      confirmPasswordControl?.clearValidators();
      this.loginForm.clearValidators();
    }
    confirmPasswordControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    passwordControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.loginForm.updateValueAndValidity({ emitEvent: false });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    if (control instanceof FormGroup) {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    }
    return null;
  };

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.initForm();
    this.error = null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (this.isSignUp) {
        this.error = 'Sign-up is not supported by the current API. Please contact the administrator.';
        return;
      }
      // Login mode
      this.loginService.login(username, password).subscribe({
        next: (response) => {
          const token = response?.data?.attributes?.token; // Adjust based on actual API response
          if (token) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify({ username }));
            this.error = null;
            this.router.navigate([this.returnUrl]);
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
}
