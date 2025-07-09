import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthJwtService } from './auth-jwt.service';
import {AuthService} from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly resourceUrl = 'https://vn-fe-test-api.iwalabs.info';
  private readonly authToken = 'Aa123456';

  constructor(
    private http: HttpClient,
    private authServerProvider: AuthJwtService,
    private authService: AuthService
  ) {}

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
    return this.http.post(`${this.resourceUrl}/auth`, body, { headers }).pipe(
      tap((response: any) => {
        const token = response?.data?.attributes?.token;
        if (token) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', token);
          this.authService.setUserInfo(username);
        }
      })
    );
  }

  logout() {
    this.authServerProvider.logout().subscribe();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    this.authService.clearUserInfo();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
