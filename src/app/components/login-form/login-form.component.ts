import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { StorageService } from '../../services/storage/storage.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgbAlertModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  private storageService = inject(StorageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);
  private toastrService = inject(ToastrService);

  error: string | null = null;
  loginForm!: FormGroup;
  isSignUp = false;
  returnUrl: string = '/';

  constructor() {}

  ngOnInit() {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
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
      this.loginService.login(username, password).subscribe({
        next: (response) => {
          const token = response?.data?.attributes?.token;
          if (token) {
            this.storageService.saveData('isLoggedIn', true);
            this.storageService.saveData('token', token);
            this.storageService.saveData('userInfo', { username });
            this.error = null;
            this.toastrService.success('You are logged in as Administrator', 'Success');
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
