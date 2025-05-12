import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenService } from './services/token.service';

export function tokenGetter() {
  const tokenService = inject(TokenService);
  return tokenService.getToken();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        positionClass: 'toast-top-left',
        preventDuplicates: true,
        closeButton: true,
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        tapToDismiss: true,
      }),
      JwtModule.forRoot({
        config: {
          tokenGetter,
          allowedDomains: ['localhost:8088'],
        },
      })
    ),
  ],
};
