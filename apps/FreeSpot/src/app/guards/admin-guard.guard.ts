import { inject, Signal } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '@free-spot-service/user';
import { Role } from '@free-spot/enums';
import { FreeSpotUser } from '@free-spot/models';

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

  if (Object.keys(currentUserSig()).length) {
    return currentUserSig().role === Role.ADMIN;
  }
  return false;
};
