import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const xsrfToken = authService.xsrfTokenSignal$();

  const isMutating =
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'PATCH' ||
    req.method === 'DELETE';

  if (!isMutating || !xsrfToken) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        'X-XSRF-TOKEN': xsrfToken,
      },
    }),
  );
};
