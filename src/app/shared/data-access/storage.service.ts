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
  private readonly updateData$ = new Subject<AppStateData>();
  private readonly currentVersion = 1;
  private _state: AppStateData = this.getInitialState();  // In-memory state

  readonly appState = toSignal(this.updateData$.pipe(startWith(this._state)), {
    initialValue: this._state,
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
    const newState = {
      ...this._state,
      [key]: data,
      version: this.currentVersion,
    };
    this._state = newState;
    this.updateData$.next(newState);
    return newState;
  }

  private getInitialState(): AppStateData {
    return {
      ...appStateInitialData,
      version: this.currentVersion,
    };
  }
}
