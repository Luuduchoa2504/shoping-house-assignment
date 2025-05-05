import { Injectable, inject, computed } from '@angular/core';
import {StorageService} from '../services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageService = inject(StorageService);
  readonly userInfo = computed(() => this.storageService.appState()?.userInfo);
  readonly isLoggedIn = computed(() => this.storageService.appState()?.isLoggedIn ?? false);

  setUserInfo(username: string) {
    const userInfo = { username };
    this.storageService.saveData('userInfo', userInfo);
  }

  clearUserInfo() {
    this.storageService.clearData('userInfo');
    this.storageService.saveData('isLoggedIn', false);
    this.storageService.clearData('token');
  }
}
