import {inject, isDevMode} from '@angular/core';
import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {catchError, tap} from 'rxjs/operators';
import {Store} from '@app/core/stores/Store';
import {AuthService} from '@app/core/auth/service/auth.service';
import AppUtils from '@app/shared/utils/AppUtils';

export const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const location = inject(Location);
  const authService = inject(AuthService);
  const store = inject(Store);

  let request = req.clone({
    withCredentials: true,
    headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
  });

  return next(request).pipe(
    tap(evt => {
      // Handle successful responses if needed
    }),
    catchError((error) => {
      if (!store.getInitializeStatus().initialized) {
        if (isDevModeInitializedAuthError(error)) {
          console.info("Could not initialize app because request to ui-config returns 401. Redirecting to IDP");
          AppUtils.redirectToOAuthPage(location);
          //return of(null);
          return of(new HttpResponse({status: 401}));
        }
      }

      if (AppUtils.isAuthenticatedHttpRequest(error)) {
        return throwError(error);
      } else {
        authService.openUnauthenticatedDialog();
        //return of(null);
        return of(new HttpResponse({status: 401}));
      }
    })
  );
};

function isDevModeInitializedAuthError(error: any): boolean {
  if (isDevMode() && AppUtils.isUnauthenticatedHttpRequest(error)) {
    return true;
  }
  return false;
}
