import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { StorageService } from '../../shared/data-access/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  storageService = inject(StorageService);

  private userInfoSignal = signal<{ username: string } | undefined>(this.storageService.appState()?.userInfo);
  private isLoggedInSignal = signal<boolean>(this.storageService.appState()?.isLoggedIn || false);

  userInfo = computed(() => this.userInfoSignal());
  isLoggedIn = computed(() => this.isLoggedInSignal());

  constructor() {
    effect(() => {
      const state = this.storageService.appState();
      this.userInfoSignal.set(state?.userInfo);
      this.isLoggedInSignal.set(!!state?.isLoggedIn);
    });
  }

  setUserInfo(username: string): void {
    this.storageService.saveData('userInfo', { username });
  }

  clearUserInfo(): void {
    this.storageService.clearData('userInfo');
    this.storageService.saveData('isLoggedIn', false);
  }
}
