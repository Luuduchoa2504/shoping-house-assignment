import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthJwtService } from '../../core/auth-jwt.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly resourceUrl = 'https://vn-fe-test-api.iwalabs.info';
  private readonly authToken = 'Aa123456';

  constructor(private http: HttpClient, private authServerProvider: AuthJwtService) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'authentication': this.authToken,
      'Content-Type': 'application/vnd.api+json'
    });

    const body = {
      data: {
        type: 'auth',
        attributes: {
          username,
          password
        }
      }
    };

    console.log('Sending login request', { url: `${this.resourceUrl}/auth`, body });
    return this.http.post(`${this.resourceUrl}/auth`, body, { headers }).pipe(
      tap((response: any) => {
        console.log('Login response', response);
        const token = response?.data?.attributes?.token;
        if (token) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', token);
          localStorage.setItem('userInfo', JSON.stringify({ username }));
        }
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'authentication': this.authToken,
      'Content-Type': 'application/vnd.api+json'
    });

    const body = {
      data: {
        type: 'users',
        attributes: {
          username,
          password
        }
      }
    };

    console.log('Sending register request', { url: `${this.resourceUrl}/register`, body });
    return this.http.post(`${this.resourceUrl}/register`, body, { headers }).pipe(
      tap(response => {
        console.log('Register response', response);
      })
    );
  }

  logout() {
    this.authServerProvider.logout().subscribe();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
