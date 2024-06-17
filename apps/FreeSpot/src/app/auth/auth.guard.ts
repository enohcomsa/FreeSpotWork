import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  if (inject(AuthService).userSignal$() !== null) {
    return true;
  }
  return inject(Router).createUrlTree(['/auth']);
};
