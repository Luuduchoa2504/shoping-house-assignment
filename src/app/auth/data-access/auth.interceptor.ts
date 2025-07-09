import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/auth')) {
      const headers = req.headers.set('Content-Type', 'application/vnd.api+json');
      return next.handle(req.clone({ headers }));
    }

    const token = this.loginService.getToken();
    const headers = req.headers
      .set('Content-Type', 'application/vnd.api+json')
      .set('authentication', token ?? '');

    return next.handle(req.clone({ headers })).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.loginService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}
