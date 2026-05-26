import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AdminUserAccessStore } from '@free-spot/admin-user-access/data-access';
import { type AdminUser } from '@free-spot/admin-user-access/domain';
import { ConfirmModalService } from '@free-spot/core/ui';
import { FormErrorMessage } from  '@free-spot/shared/util';

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
  private readonly formBuilder = inject(FormBuilder);
  private readonly store = inject(AdminUserAccessStore);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly formErrorMessage = inject(FormErrorMessage);
  private readonly destroyRef = inject(DestroyRef);

  readonly userListSig: Signal<AdminUser[]> = this.store.usersSig;

  readonly adminUserListSig: Signal<AdminUser[]> = computed(() =>
    this.userListSig().filter((user) => user.role === 'ADMIN'),
  );

  readonly memberUserListSig: Signal<AdminUser[]> = computed(() =>
    this.userListSig().filter((user) => user.role === 'MEMBER'),
  );

  readonly foundMemberUserListSig: WritableSignal<AdminUser[]> = signal([]);

  addAdminFormGroup = this.formBuilder.group({
    user: [null as AdminUser | string | null, [Validators.required]],
  });

  ngOnInit(): void {
    this.store.init();

    this.addAdminFormGroup.controls.user.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
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
          this.memberUserListSig().filter((user) =>
            `${user.firstName ?? ''} ${user.familyName ?? ''} ${user.email}`.toLowerCase().includes(query),
          ),
        );
      });

    this.foundMemberUserListSig.set(this.memberUserListSig());
  }

  displayError = (control: AbstractControl | null): string => this.formErrorMessage.displayFormErrorMessage(control);

  displayUser = (user?: AdminUser | string | null): string => {
    if (!user || typeof user === 'string') {
      return typeof user === 'string' ? user : '';
    }

    return this.getUserDisplayName(user);
  };

  getUserDisplayName(user: AdminUser): string {
    return `${user.firstName ?? ''} ${user.familyName ?? ''}`.trim() || user.email;
  }

  onAddAdmin(): void {
    const value = this.addAdminFormGroup.controls.user.value;

    if (!value || typeof value === 'string') {
      return;
    }

    this.confirmService
      .openConfirmDialog(`Are you sure you want to make ${this.getUserDisplayName(value)} an admin?`)
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.store.makeAdmin(value.id);
          this.addAdminFormGroup.reset();
          this.foundMemberUserListSig.set(this.memberUserListSig());
        }
      });
  }

  onRemoveAdmin(userId: string): void {
    const user = this.adminUserListSig().find((item) => item.id === userId);
    const label = user ? this.getUserDisplayName(user) : 'this user';

    this.confirmService
      .openConfirmDialog(`Are you sure you want to remove admin rights from ${label}?`)
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.store.removeAdmin(userId);
          this.foundMemberUserListSig.set(this.memberUserListSig());
        }
      });
  }
}
