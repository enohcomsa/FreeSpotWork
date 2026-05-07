import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@free-spot/core';

const RETRY_COUNT = new HttpContextToken<number>(() => 0);
const MAX_RETRIES = 3;

const AUTH_ROUTES_TO_SKIP = [
  '/auth/login',
  '/auth/signup',
  '/auth/me',
  '/auth/refresh',
  '/auth/logout',
] as const;

function shouldSkipRefreshHandling(url: string): boolean {
  return AUTH_ROUTES_TO_SKIP.some((route) => url.includes(route));
}

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const retryCount = req.context.get(RETRY_COUNT);

  if (shouldSkipRefreshHandling(req.url)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (retryCount >= MAX_RETRIES) {
        authService.logoutLocal();
        return throwError(() => error);
      }

      return authService.refreshSession().pipe(
        switchMap(() =>
          next(
            req.clone({
              context: req.context.set(RETRY_COUNT, retryCount + 1),
            }),
          ),
        ),
        catchError((refreshError) => {
          authService.logoutLocal();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
