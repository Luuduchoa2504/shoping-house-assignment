import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
// import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { map, Observable } from "rxjs";
import {AuthService} from "./auth.service";

type JwtToken = {
  id_token: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthJwtService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getToken(): string {
    return 'null'
    // const tokenInLocalStorage: string | null = this.$localStorage.retrieve(
    //   Constants.KEY_TOKEN
    // );
    // const tokenInSessionStorage: string | null = this.$sessionStorage.retrieve(
    //   Constants.KEY_TOKEN
    // );
    // return tokenInLocalStorage ?? tokenInSessionStorage ?? '';
  }

  // login(credentials: null): Observable<void> {
  //   return null;
  //   // return this.http
  //   //   .post<JwtToken>(
  //   //     Constants.SERVER_API_URL + 'api/auth',
  //   //     //hardcode rememberMe to false
  //   //     {...credentials, rememberMe: false}
  //   //   )
  //   //   .pipe(
  //   //     map((response) =>
  //   //       this.authenticateSuccess(response, credentials.rememberMe)
  //   //     )
  //   //   );
  // }

  logout(): Observable<void> {
    return new Observable(observer => {})
    // return new Observable((observer) => {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('userInfo');
    //   observer.complete();
    // })
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    // const jwt = response.id_token;
    // // const key = `vc)3@mqUjZjb8D'xb@#Qg{mRAunV,";yVDM48eY8A;MFf=xZ{=`;
    // // const userInfo = verify(jwt, key)
    // // this.authService.setUserInfo(userInfo.toString());
    // if (rememberMe) {
    //   this.$localStorage.store(Constants.KEY_TOKEN, jwt);
    //   this.$sessionStorage.clear(Constants.KEY_TOKEN);
    // } else {
    //   this.$sessionStorage.store(Constants.KEY_TOKEN, jwt);
    //   this.$localStorage.clear(Constants.KEY_TOKEN);
    // }
  }
}
