import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  AuthHttpService,
  AuthOkResponseDTO,
  LoginRequestDTO,
  MeResponseDTO,
  RefreshResponseDTO,
  SignupRequestDTO,
} from '@free-spot/api-client';
import { authDtoToDomain, User } from '@free-spot-domain/user';
import { Role } from '@free-spot/enums';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _authHttp = inject(AuthHttpService);
  private readonly _router = inject(Router);

  private readonly _user = signal<User | null>(null);
  private readonly _xsrfToken = signal<string | null>(null);
  private readonly _initialized = signal(false);
  private readonly _loadingMe = signal(false);

  private _loadMeInFlight$: Observable<MeResponseDTO | null> | null = null;
  private _refreshSessionInFlight$: Observable<void> | null = null;

  readonly userSignal$ = this._user.asReadonly();
  readonly xsrfTokenSignal$ = this._xsrfToken.asReadonly();
  readonly initializedSignal$ = this._initialized.asReadonly();
  readonly loadingMeSignal$ = this._loadingMe.asReadonly();

  readonly isAuthenticated = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === Role.ADMIN);

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
    if (this._loadMeInFlight$) {
      return this._loadMeInFlight$;
    }

    this._loadingMe.set(true);

    this._loadMeInFlight$ = this._authHttp.authMe().pipe(
      tap((response: MeResponseDTO) => {
        this._setUserFromResponse(response);
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      }),
      finalize(() => {
        this._loadingMe.set(false);
        this._loadMeInFlight$ = null;
      }),
      shareReplay(1),
    );

    return this._loadMeInFlight$;
  }

  refreshSession(): Observable<void> {
    if (this._refreshSessionInFlight$) {
      return this._refreshSessionInFlight$;
    }

    this._refreshSessionInFlight$ = this._authHttp.authRefresh({ body: {} }).pipe(
      tap((response: RefreshResponseDTO) => {
        this.setXsrfToken(response.xsrfToken ?? null);
      }),
      switchMap(() => this.loadMe()),
      map(() => void 0),
      catchError((error) => {
        this.clearSession();
        return throwError(() => error);
      }),
      finalize(() => {
        this._refreshSessionInFlight$ = null;
      }),
      shareReplay(1),
    );

    return this._refreshSessionInFlight$;
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
