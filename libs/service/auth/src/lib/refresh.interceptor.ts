import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthHttpService } from '@free-spot/api-client';
import { AuthService } from './auth.service';

const RETRY_COUNT = new HttpContextToken<number>(() => 0);
const MAX_RETRIES = 3;

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authHttp = inject(AuthHttpService);
  const authService = inject(AuthService);

  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/signup') ||
    req.url.includes('/auth/me') ||
    req.url.includes('/auth/refresh')
  ) {
    return next(req);
  }

  const retryCount = req.context.get(RETRY_COUNT);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (retryCount >= MAX_RETRIES) {
        authService.logout();
        return throwError(() => error);
      }

      return authHttp.authRefresh({ body: {} }).pipe(
        switchMap(() => authService.loadMe()),
        switchMap(() =>
          next(
            req.clone({
              context: req.context.set(RETRY_COUNT, retryCount + 1),
            }),
          ),
        ),
        catchError((refreshError) => {
          authService.logout();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
