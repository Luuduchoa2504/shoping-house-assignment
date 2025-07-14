import { Injectable } from '@angular/core';
import { startWith, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export type AppStateData = {
  userInfo?: {
    username: string;
  };
  isLoggedIn?: boolean;
  token?: string;
  version?: number;
};

export const appStateInitialData: AppStateData = {
  userInfo: undefined,
  isLoggedIn: false,
  token: undefined,
  version: undefined,
};

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly APP_STATE_KEY = 'APP_STATE';
  private readonly updateData$ = new Subject<AppStateData>();
  private readonly currentVersion = 1;

  readonly appState = toSignal(this.updateData$.pipe(startWith(this.loadFromCookie())), {
    initialValue: this.loadFromCookie(),
  });

  constructor() {
  }

  saveData<T extends keyof AppStateData>(key: T, data: AppStateData[T]): void {
    this.saveAndReturnState(key, data);
  }

  clearData(key: keyof AppStateData): void {
    this.saveData(key, undefined);
  }

  private saveAndReturnState<T extends keyof AppStateData>(key: T, data: AppStateData[T]): AppStateData {
    const currentState = this.appState() || appStateInitialData;
    const newState = {
      ...currentState,
      [key]: data,
      version: this.currentVersion,
    };
    this.saveToCookie(newState);
    this.updateData$.next(newState);
    return newState;
  }

  private loadFromCookie(): AppStateData {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    const storedState = cookies[this.APP_STATE_KEY];
    if (storedState) {
      try {
        const parsedState = JSON.parse(decodeURIComponent(storedState));
        if (parsedState.version === this.currentVersion) {
          return parsedState;
        }
      } catch (e) {
        console.error('Invalid cookie state');
      }
    }
    return this.getInitialState();
  }

  private saveToCookie(state: AppStateData): void {
    const cookieValue = encodeURIComponent(JSON.stringify(state));
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    document.cookie = `${this.APP_STATE_KEY}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;  // Removed Secure
  }

  private getInitialState(): AppStateData {
    return {
      ...appStateInitialData,
      version: this.currentVersion,
    };
  }
}
