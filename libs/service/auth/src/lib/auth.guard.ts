import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);

  if (authService.userSignal$() !== null) {
    if (authService.userSignal$()?.token === null) {
      authService.logOut();
    } else {
      return true;
    }
  }
  return inject(Router).createUrlTree(['/auth']);
};
