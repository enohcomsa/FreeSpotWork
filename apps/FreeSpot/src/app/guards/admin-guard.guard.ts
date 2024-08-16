import { inject, Signal } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '@free-spot-service/user';
import { Role } from '@free-spot/enums';
import { FreeSpotUser } from '@free-spot/models';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const _userService: UserService = inject(UserService);
  _userService.init();
  const _currentUserEmail = (
    JSON.parse(localStorage.getItem('user') as string) as {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    }
  )?.email;
  const currentUserSig: Signal<FreeSpotUser> = _userService.getFreeSpotUserByEmail(_currentUserEmail);

  return toObservable(currentUserSig).pipe(
    filter((user) => !!Object.keys(user).length),
    take(1),
    map((user: FreeSpotUser) => user.role === Role.ADMIN),
  );
};
