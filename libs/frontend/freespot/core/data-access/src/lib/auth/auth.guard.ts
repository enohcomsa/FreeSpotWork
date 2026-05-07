import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@free-spot/core/data-access';
import { map, Observable} from 'rxjs';

export const authGuard: CanActivateFn = (): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  if (authService.initializedSignal$()) {
    return router.createUrlTree(['/auth']);
  }

  return authService.loadMe().pipe(
    map(() => {
      return authService.isAuthenticated() ? true : router.createUrlTree(['/auth']);
    }),
  );
};
