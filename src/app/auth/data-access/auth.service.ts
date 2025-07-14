import { Injectable, signal, computed, inject, effect, OnDestroy } from '@angular/core';  // Add OnDestroy
import { StorageService } from '../../shared/data-access/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  storageService = inject(StorageService);

  private userInfoSignal = signal<{ username: string } | undefined>(this.storageService.appState()?.userInfo);
  private isLoggedInSignal = signal<boolean>(this.storageService.appState()?.isLoggedIn || false);

  userInfo = computed(() => this.userInfoSignal());
  isLoggedIn = computed(() => this.isLoggedInSignal());

  private refreshTimer: any;

  constructor() {
    effect(() => {
      const state = this.storageService.appState();
      this.userInfoSignal.set(state?.userInfo);
      this.isLoggedInSignal.set(!!state?.isLoggedIn);
    });

    effect(() => {
      if (this.isLoggedIn()) {
        this.startRefreshTimer();
      } else {
        this.clearRefreshTimer();
      }
    });
  }

  setUserInfo(username: string): void {
    this.storageService.saveData('userInfo', { username });
  }

  clearUserInfo(): void {
    this.storageService.clearData('userInfo');
    this.storageService.saveData('isLoggedIn', false);
    this.storageService.clearData('token');  // Clear token too
  }

  private startRefreshTimer(): void {
    this.clearRefreshTimer();
    this.refreshTimer = setTimeout(() => {
      console.log('Token expired after 5 min; forcing logout');
      this.clearUserInfo();
    }, 5 * 60 * 1000);
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearRefreshTimer();  // Cleanup on destroy
  }
}
