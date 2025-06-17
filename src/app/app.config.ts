import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from './shared/interceptors/auth-token-interceptor';
import { authTokenRefreshInterceptor } from './shared/interceptors/auth-token-refresh-interceptor';
import { ICON_PROVIDERS } from '../icons.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authTokenInterceptor, authTokenRefreshInterceptor])
    ),
    ICON_PROVIDERS,
  ],
};
