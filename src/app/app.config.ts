import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import {authInterceptor} from './auth/data-access/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({}),
    provideEffects(),
    provideToastr({}),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor]))],
};
