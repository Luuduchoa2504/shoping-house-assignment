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

  readonly appState = toSignal(this.updateData$.pipe(startWith(this.getInitialState())), {
    initialValue: this.getInitialState(),
  });

  constructor() {
    this.loadFromLocalStorage();
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
    localStorage.setItem(this.APP_STATE_KEY, JSON.stringify(newState));
    this.updateData$.next(newState);
    return newState;
  }

  private loadFromLocalStorage(): void {
    const storedState = localStorage.getItem(this.APP_STATE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      if (parsedState.version === this.currentVersion) {
        this.updateData$.next(parsedState);
      } else {
        this.updateData$.next(this.getInitialState());
        localStorage.removeItem(this.APP_STATE_KEY);
      }
    }
  }

  private getInitialState(): AppStateData {
    return {
      ...appStateInitialData,
      version: this.currentVersion,
    };
  }
}
