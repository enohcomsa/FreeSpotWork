import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';
import {
  AuthHttpService,
  AuthOkResponseDTO,
  LoginRequestDTO,
  MeResponseDTO,
  SignupRequestDTO,
} from '@free-spot/api-client';
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
  private _xsrfToken = signal<string | null>(null);
  private _initialized = signal(false);
  private _loadingMe = signal(false);

  userSignal$ = this._user.asReadonly();
  xsrfTokenSignal$ = this._xsrfToken.asReadonly();
  initializedSignal$ = this._initialized.asReadonly();
  loadingMeSignal$ = this._loadingMe.asReadonly();

  isAuthenticated = computed(() => !!this._user());
  isAdmin = computed(() => this._user()?.role === Role.ADMIN);

  login(payload: LoginRequestDTO): Observable<MeResponseDTO | null> {
    return this._authHttp.authLogin({ loginRequestDTO: payload }).pipe(
      tap((response: AuthOkResponseDTO) => {
        this.setXsrfToken(response.xsrfToken ?? null);
      }),
      switchMap(() => this.loadMe()),
    );
  }

  signup(payload: SignupRequestDTO): Observable<MeResponseDTO | null> {
    return this._authHttp.authSignup({ signupRequestDTO: payload }).pipe(
      tap((response: AuthOkResponseDTO) => {
        this.setXsrfToken(response.xsrfToken ?? null);
      }),
      switchMap(() => this.loadMe()),
    );
  }

  logoutLocal(): void {
    this.clearSession();
    void this._router.navigate(['/auth']);
  }

  logout(): void {
    this._authHttp.authLogout({ body: {} }).subscribe({
      next: () => {
        this.clearSession();
        void this._router.navigate(['/auth']);
      },
      error: () => {
        this.clearSession();
        void this._router.navigate(['/auth']);
      },
    });
  }

  loadMe(): Observable<MeResponseDTO | null> {
    if (this._loadingMe()) {
      return of(null);
    }

    this._loadingMe.set(true);

    return this._authHttp.authMe().pipe(
      tap((response: MeResponseDTO) => {
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

  setXsrfToken(token: string | null): void {
    this._xsrfToken.set(token);
  }

  clearSession(): void {
    this._user.set(null);
    this._xsrfToken.set(null);
    this._initialized.set(true);
  }

  private _setUserFromResponse(response: MeResponseDTO | AuthOkResponseDTO): void {
    if (!response.user?.id || !response.user.email || !response.user.role) {
      this.clearSession();
      return;
    }

    this._user.set(authDtoToDomain(response.user));
    this._initialized.set(true);
  }
}
