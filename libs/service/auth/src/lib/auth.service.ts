import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { AuthHttpService, AuthOkResponseDTO, LoginRequestDTO, SignupRequestDTO } from '@free-spot/api-client';
import { Router } from '@angular/router';
import { authDtoToDomain, User } from '@free-spot-domain/user';
import { Role } from '@free-spot/enums';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authHttp = inject(AuthHttpService);
  private _router = inject(Router);

  private _user = signal<User | null>(null);
  private _initialized = signal(false);
  private _loadingMe = signal(false);

  userSignal$ = this._user.asReadonly();
  initializedSignal$ = this._initialized.asReadonly();
  loadingMeSignal$ = this._loadingMe.asReadonly();

  isAuthenticated = computed(() => !!this._user());
  isAdmin = computed(() => this._user()?.role === Role.ADMIN);

login(payload: LoginRequestDTO): Observable<AuthOkResponseDTO | null> {
  return this._authHttp.authLogin({ loginRequestDTO: payload }).pipe(
    switchMap(() => this.loadMe()),
  );
}

signup(payload: SignupRequestDTO): Observable<AuthOkResponseDTO | null> {
  return this._authHttp.authSignup({ signupRequestDTO: payload }).pipe(
    switchMap(() => this.loadMe()),
  );
}

  logout(): void {
    this.clearSession();
    this._router.navigate(['/auth']);
  }

  loadMe(): Observable<AuthOkResponseDTO | null> {
    if (this._loadingMe()) {
      return of(null);
    }

    this._loadingMe.set(true);

    return this._authHttp.authMe().pipe(
      tap((response: AuthOkResponseDTO) => {
        this._setUserFromResponse(response);
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      }),
      finalize(() => {
        this._loadingMe.set(false);
      }),
    );
  }

  clearSession(): void {
    this._user.set(null);
    this._initialized.set(true);
  }

  private _setUserFromResponse(response: AuthOkResponseDTO): void {
    if (!response.user?.id || !response.user.email || !response.user.role) {
      this.clearSession();
      return;
    }

    this._user.set(authDtoToDomain(response.user));
    this._initialized.set(true);
  }
}
