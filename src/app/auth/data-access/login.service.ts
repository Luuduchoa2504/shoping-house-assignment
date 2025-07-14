import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthJwtService } from './auth-jwt.service';
import { AuthService } from './auth.service';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly resourceUrl = environment.apiUrl;
  private readonly authToken = environment.authToken;

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
            this.authService.setUserInfo(username);
            this.authService.storageService.saveData('isLoggedIn', true);
            this.authService.storageService.saveData('token', token);
          }
        })
    );
  }

  logout() {
    this.authServerProvider.logout().subscribe();
    this.authService.clearUserInfo();
    this.authService.storageService.clearData('token');
  }

  getToken(): string | null {
    return this.authService.storageService.appState()?.token ?? null;
  }
}
