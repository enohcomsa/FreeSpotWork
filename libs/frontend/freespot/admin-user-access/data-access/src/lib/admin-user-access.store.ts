import { Injectable, inject, signal } from '@angular/core';
import { Role } from '@free-spot/core/domain';
import { type AdminUser } from '@free-spot/admin-user-access/domain';
import { take } from 'rxjs';
import { HttpAdminUserAccessService } from './http-admin-user-access.service';

@Injectable({ providedIn: 'root' })
export class AdminUserAccessStore {
  private readonly _api = inject(HttpAdminUserAccessService);

  private readonly _userListSig = signal<AdminUser[]>([]);
  readonly userListSig = this._userListSig.asReadonly();

  init(): void {
    if (this._userListSig().length) {
      return;
    }

    this._api
      .listUsers$()
      .pipe(take(1))
      .subscribe((users) => {
        this._userListSig.set(users);
      });
  }

  makeAdmin(userId: string): void {
    this._updateRole(userId, Role.ADMIN);
  }

  removeAdmin(userId: string): void {
    this._updateRole(userId, Role.MEMBER);
  }

  private _updateRole(userId: string, role: Role): void {
    this._api
      .updateUserRole$(userId, role)
      .pipe(take(1))
      .subscribe(() => {
        this._userListSig.update((users) =>
          users.map((user) => (user.id === userId ? { ...user, role } : user))
        );
      });
  }
}
