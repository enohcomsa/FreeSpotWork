import { Injectable, Signal, inject } from '@angular/core';
import { Role, User } from '@free-spot-domain/user';
import { UserService } from '@free-spot-service/user';

@Injectable({ providedIn: 'root' })
export class AdminUserAccessStore {
  private _userService = inject(UserService);

  readonly userListSig: Signal<User[]> = this._userService.userListSig;

  init(): void {
    this._userService.init();
  }

  makeAdmin(userId: string): void {
    this._userService.updateUser(userId, { role: Role.ADMIN });
  }

  removeAdmin(userId: string): void {
    this._userService.updateUser(userId, { role: Role.MEMBER });
  }
}
