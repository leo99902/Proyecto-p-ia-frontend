import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenAuthInterceptor } from './auth/token/token.auth.interceptor';
import { errorInterceptor } from './auth/token/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([tokenAuthInterceptor, errorInterceptor])),
    provideHttpClient(withInterceptors([tokenAuthInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    // provideHttpClient(withInterceptors([tokenAuthInterceptor]))
  ]
};