import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (req.url.includes('/auth')) {
    const headers = req.headers.set('Content-Type', 'application/vnd.api+json');
    return next(req.clone({ headers }));
  }

  const token = loginService.getToken();

  if (req.method === 'GET') {
    const headers = req.headers.set('Content-Type', 'application/vnd.api+json');
    if (token) {
      headers.set('authentication', token);
    }
    return next(req.clone({ headers })).pipe(
      catchError(err => {
        if (err.status === 400 || err.status === 401) {
          loginService.logout();
          router.navigate(['/signup']);
        }
        return throwError(() => err);
      })
    );
  }

  if (!token) {
    router.navigate(['/signup']);
    return throwError(() => new Error('No authentication token available'));
  }

  const headers = req.headers
    .set('Content-Type', 'application/vnd.api+json')
    .set('authentication', token);

  return next(req.clone({ headers })).pipe(
    catchError(err => {
      if (err.status === 400 || err.status === 401) {
        loginService.logout();
        router.navigate(['/signup']);
      }
      return throwError(() => err);
    })
  );
}
