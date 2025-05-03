import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  userInfo = new BehaviorSubject<{username: string} | null>(null);

  setUserInfo(username: string) {
    this.userInfo.next({username});
  }

  getUserInfo() {
    return this.userInfo.asObservable();
  }
}
