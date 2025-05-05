import { Injectable, signal, computed } from '@angular/core';
import {startWith, Subject} from 'rxjs';
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
    };
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
