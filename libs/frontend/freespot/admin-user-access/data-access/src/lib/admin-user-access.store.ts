import { inject, Injectable, signal } from '@angular/core';
import { type Role } from '@free-spot/core/domain';
import { type AdminUser } from '@free-spot/admin-user-access/domain';
import { take } from 'rxjs';
import { HttpAdminUserAccessService } from './http-admin-user-access.service';

@Injectable({ providedIn: 'root' })
export class AdminUserAccessStore {
  private readonly api = inject(HttpAdminUserAccessService);

  private readonly userListSig = signal<AdminUser[]>([]);

  readonly usersSig = this.userListSig.asReadonly();

  init(): void {
    if (this.userListSig().length) {
      return;
    }

    this.api
      .listUsers$()
      .pipe(take(1))
      .subscribe((users) => {
        this.userListSig.set(users);
      });
  }

  makeAdmin(userId: string): void {
    this.updateRole(userId, 'ADMIN');
  }

  removeAdmin(userId: string): void {
    this.updateRole(userId, 'MEMBER');
  }

  private updateRole(userId: string, role: Role): void {
    this.api
      .updateUserRole$(userId, role)
      .pipe(take(1))
      .subscribe(() => {
        this.userListSig.update((users) =>
          users.map((user) => (user.id === userId ? { ...user, role } : user)),
        );
      });
  }
}
