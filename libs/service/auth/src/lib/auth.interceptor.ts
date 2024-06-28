import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
// import { exhaustMap, Observable, take } from 'rxjs';
// import { User } from './models/user.model';
// import { toObservable } from '@angular/core/rxjs-interop';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  // const userUbservable$: Observable<User | null> = toObservable(authService.userSignal$);

  // return userUbservable$.pipe(
  //   take(1),
  //   exhaustMap((user: User | null) => {
  //     const tokenReq = req.clone({
  //       params: new HttpParams().set('auth', user?.token as string),
  //     });
  //     return next(tokenReq);
  //   })
  // );

  if (!authService.userSignal$()) {
    return next(req);
  }

  const tokenReq = req.clone({
    params: new HttpParams().set('auth', authService.userSignal$()?.token as string),
  });
  return next(tokenReq);
};
