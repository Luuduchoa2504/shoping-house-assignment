import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userInfoSubject = new BehaviorSubject<{ username: string } | null>(null);

  constructor() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.userInfoSubject.next(JSON.parse(userInfo));
    }
  }

  setUserInfo(username: string) {
    const userInfo = { username };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.userInfoSubject.next(userInfo);
  }

  clearUserInfo() {
    localStorage.removeItem('userInfo');
    this.userInfoSubject.next(null); // Phát ra null khi logout
  }

  getUserInfo() {
    return this.userInfoSubject.asObservable();
  }
}
