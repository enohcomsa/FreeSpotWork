import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Role, User } from '@free-spot-domain/user';

import { FormErrorMessage } from '@free-spot/util';

import { UserService } from '@free-spot-service/user';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';

import { AdminUniversityMapComponent } from '@free-spot/admin-university-map/feature';
import { AdminEventsComponent } from '@free-spot/admin-events/feature';
import { AdminAcademicStructureComponent } from '@free-spot/admin-academic-structure/feature';

@Component({
  selector: 'free-spot-admin',
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    AdminUniversityMapComponent,
    AdminEventsComponent, AdminAcademicStructureComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _userService: UserService = inject(UserService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);

  readonly userListSig: Signal<User[]> = this._userService.userListSig;
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
    this._userService.init();

    this.addAdminFormGroup.controls['user'].valueChanges.subscribe((value) => {
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
          this._userService.updateUser(user.id, { role: Role.ADMIN });
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
          this._userService.updateUser(userId, { role: Role.MEMBER });
          this.foundMemberUserListSig.set(this.memberUserListSig());
        }
      });
  }
}
