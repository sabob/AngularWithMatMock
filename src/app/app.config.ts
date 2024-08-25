import {APP_INITIALIZER, ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptorFn} from "@app/core/interceptors/auth.interceptor";
import {Store} from "@app/core/stores/Store";
import {AuthService} from "@app/core/auth/service/auth.service";
import AppUtils from "@app/shared/utils/AppUtils";
import {Location} from "@angular/common";
import {routes} from "@app/routes/app.routes";
import {InitService} from "@app/core/bootstrap/service/init.service";

export const appConfig: ApplicationConfig = {


  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    //importProvidersFrom(MaterialModule),
    provideHttpClient(withInterceptors([authInterceptorFn])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      multi: true,
      deps: [InitService, Location, Store, AuthService],
    },
  ]
};

export function initializeAppFactory(service: InitService, location: Location, store: Store, authService: AuthService) {
  return () => initializeApp(service, location, store, authService);
}

async function initializeApp(service: InitService, location: Location, store: Store, authService: AuthService) {
  try {
    let result = await service.init();
    return Promise.resolve(result);

  } catch (err: any) {
    console.error("app could not initialize", err);

    let status = store.getInitializeStatus();
    status.errorMessage = err.message;

    let promise = new Promise(function (resolve, reject) {

      if (AppUtils.isPossibleAuthenticationError(err)) {

        if (isDevMode()) {
          AppUtils.redirectToOAuthPage(location);
          return;
        }

        authService.openUnauthenticatedDialog();

      }

      resolve(err);
    });
    return promise;
  }
}

