import { ChangeDetectionStrategy, Component, OnInit, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Role, User } from '@free-spot/core/domain';
import { ConfirmModalService } from '@free-spot/core/ui';
import { AdminUserAccessStore } from '@free-spot/admin-user-access/data-access';
import { FormErrorMessage } from '@free-spot/util';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'free-spot-admin-user-access',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  templateUrl: './admin-user-access.component.html',
  styleUrl: './admin-user-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserAccessComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _store = inject(AdminUserAccessStore);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _destroyRef = inject(DestroyRef);

  readonly userListSig: Signal<User[]> = this._store.userListSig;
  readonly adminUserListSig: Signal<User[]> = computed(() =>
    this.userListSig().filter((user: User) => user.role === Role.ADMIN)
  );
  readonly memberUserListSig: Signal<User[]> = computed(() =>
    this.userListSig().filter((user: User) => user.role === Role.MEMBER)
  );
  readonly foundMemberUserListSig: WritableSignal<User[]> = signal([]);

  addAdminFormGroup = this._formBuilder.group({
    user: [null as User | string | null, [Validators.required]],
  });

  ngOnInit(): void {
    this._store.init();

    this.addAdminFormGroup.controls['user'].valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => {
        if (!value) {
          this.foundMemberUserListSig.set(this.memberUserListSig());
          return;
        }

        if (typeof value !== 'string') {
          return;
        }

        const query = value.toLowerCase().trim();

        this.foundMemberUserListSig.set(
          this.memberUserListSig().filter((user: User) =>
            `${user.firstName ?? ''} ${user.familyName ?? ''} ${user.email}`.toLowerCase().includes(query)
          )
        );
      });

    this.foundMemberUserListSig.set(this.memberUserListSig());
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  displayUser = (user?: User | string | null): string => {
    if (!user || typeof user === 'string') {
      return typeof user === 'string' ? user : '';
    }

    return this.getUserDisplayName(user);
  };

  getUserDisplayName(user: User): string {
    return `${user.firstName ?? ''} ${user.familyName ?? ''}`.trim() || user.email;
  }

  onAddAdmin(): void {
    const value = this.addAdminFormGroup.controls['user'].value;

    if (!value || typeof value === 'string') {
      return;
    }

    const user = value;

    this._confirmService
      .openConfirmDialog(`Are you sure you want to make ${this.getUserDisplayName(user)} an admin?`)
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this._store.makeAdmin(user.id);
          this.addAdminFormGroup.reset();
          this.foundMemberUserListSig.set(this.memberUserListSig());
        }
      });
  }

  onRemoveAdmin(userId: string): void {
    const user = this.adminUserListSig().find((item: User) => item.id === userId);
    const label = user ? this.getUserDisplayName(user) : 'this user';

    this._confirmService
      .openConfirmDialog(`Are you sure you want to remove admin rights from ${label}?`)
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this._store.removeAdmin(userId);
          this.foundMemberUserListSig.set(this.memberUserListSig());
        }
      });
  }
}
