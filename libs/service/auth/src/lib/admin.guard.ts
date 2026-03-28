import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthUserDTORoleEnum } from '@free-spot/api-client';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(authService.userSignal$());

  if (authService.userSignal$()?.role === AuthUserDTORoleEnum.ADMIN) {
    return true;
  }

  if (authService.initializedSignal$()) {
    return router.createUrlTree(['/dashboard']);
  }

  return authService.loadMe().pipe(
    map(() => {
      return authService.userSignal$()?.role === AuthUserDTORoleEnum.ADMIN
        ? true
        : router.createUrlTree(['/dashboard']);
    }),
  );
};
