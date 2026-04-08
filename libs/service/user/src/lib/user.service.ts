import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, take, tap, throwError } from 'rxjs';
import { User, UpdateMyPreferencesCmd, UpdateMyProfileCmd, UpdateUserCmd } from '@free-spot-domain/user';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpUserService } from '@http-free-spot/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _httpUserService = inject(HttpUserService);

  private _userListSig: WritableSignal<User[]> = signal([]);
  readonly userListSig = this._userListSig.asReadonly();

  private _loadingSig: WritableSignal<boolean> = signal(false);
  readonly loadingSig = this._loadingSig.asReadonly();

  private _errorSig: WritableSignal<string | null> = signal(null);
  readonly errorSig = this._errorSig.asReadonly();

  init(): void {
    if (!this._userListSig().length) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this._loadingSig.set(true);
    this._errorSig.set(null);

    this._httpUserService
      .listUsers$()
      .pipe(take(1))
      .subscribe({
        next: (userList: User[]) => {
          this._userListSig.set(userList ?? []);
          this._loadingSig.set(false);
        },
        error: (err: unknown) => {
          console.error(err);
          this._errorSig.set('Failed to load users');
          this._loadingSig.set(false);
        },
      });
  }

  getSignalById(id: string): Signal<User> {
    return computed(() => this._userListSig().find((user: User) => user.id === id) || ({} as User));
  }

  updateMyProfile$(input: UpdateMyProfileCmd): Observable<User> {
    this._loadingSig.set(true);
    this._errorSig.set(null);

    return this._httpUserService.updateMyProfile$(input).pipe(
      tap((updatedUser: User) => {
        SignalArrayUtil.upsertBy('id', updatedUser, this._userListSig);
        this._loadingSig.set(false);
      }),
      catchError((err: unknown) => {
        console.error(err);
        this._errorSig.set('Failed to update profile');
        this._loadingSig.set(false);
        return throwError(() => err);
      })
    );
  }

  updateMyPreferences(input: UpdateMyPreferencesCmd): void {
    this._loadingSig.set(true);
    this._errorSig.set(null);

    this._httpUserService
      .updateMyPreferences$(input)
      .pipe(take(1))
      .subscribe({
        next: (updatedUser: User) => {
          SignalArrayUtil.upsertBy('id', updatedUser, this._userListSig);
          this._loadingSig.set(false);
        },
        error: (err: unknown) => {
          console.error(err);
          this._errorSig.set('Failed to update preferences');
          this._loadingSig.set(false);
        },
      });
  }

  updateUser(id: string, patch: UpdateUserCmd): void {
    this._loadingSig.set(true);
    this._errorSig.set(null);

    this._httpUserService
      .updateUser$(id, patch)
      .pipe(take(1))
      .subscribe({
        next: (updatedUser: User) => {
          SignalArrayUtil.upsertBy('id', updatedUser, this._userListSig);
          this._loadingSig.set(false);
        },
        error: (err: unknown) => {
          console.error(err);
          this._errorSig.set('Failed to update user');
          this._loadingSig.set(false);
        },
      });
  }

  deleteUser(id: string): void {
    this._loadingSig.set(true);
    this._errorSig.set(null);

    this._httpUserService
      .deleteUser$(id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          SignalArrayUtil.removeBy('id', id, this._userListSig);
          this._loadingSig.set(false);
        },
        error: (err: unknown) => {
          console.error(err);
          this._errorSig.set('Failed to delete user');
          this._loadingSig.set(false);
        },
      });
  }
}
