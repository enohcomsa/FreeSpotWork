import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.userSignal()?.role === 'ADMIN') {
    return true;
  }

  if (authService.initializedSignal()) {
    return router.createUrlTree(['/home']);
  }

  return authService.loadMe().pipe(
    map(() => {
      return authService.userSignal()?.role === 'ADMIN'
        ? true
        : router.createUrlTree(['/home']);
    }),
  );
};
