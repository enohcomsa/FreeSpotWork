import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export const guestGuard: CanActivateFn = (): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/home']);
  }

  if (authService.initializedSignal()) {
    return true;
  }

  return authService.loadMe().pipe(
    map(() => {
      return authService.isAuthenticated() ? router.createUrlTree(['/home']) : true;
    }),
  );
};
