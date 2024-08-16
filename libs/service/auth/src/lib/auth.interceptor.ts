import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);

  if (!authService.userSignal$()) {
    return next(req);
  }

  const tokenReq = req.clone({
    params: new HttpParams().set('auth', authService.userSignal$()?.token as string),
  });
  return next(tokenReq);
};
