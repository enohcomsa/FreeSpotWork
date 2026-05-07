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
import { AuthOk, LoginCmd, RefreshSessionResult, SignupCmd, User, Role } from './auth.model';
import { HttpAuthService } from './http-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _authHttp = inject(HttpAuthService);
  private readonly _router = inject(Router);

  private readonly _user = signal<User | null>(null);
  private readonly _xsrfToken = signal<string | null>(null);
  private readonly _initialized = signal(false);
  private readonly _loadingMe = signal(false);

  private _loadMeInFlight$: Observable<User | null> | null = null;
  private _refreshSessionInFlight$: Observable<void> | null = null;

  readonly userSignal$ = this._user.asReadonly();
  readonly xsrfTokenSignal$ = this._xsrfToken.asReadonly();
  readonly initializedSignal$ = this._initialized.asReadonly();
  readonly loadingMeSignal$ = this._loadingMe.asReadonly();

  readonly isAuthenticated = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === Role.ADMIN);

  login(payload: LoginCmd): Observable<User | null> {
    return this._authHttp.login$(payload).pipe(
      tap((response: AuthOk) => {
        this.setXsrfToken(response.xsrfToken);
      }),
      switchMap(() => this.loadMe()),
    );
  }

  signup(payload: SignupCmd): Observable<User | null> {
    return this._authHttp.signup$(payload).pipe(
      tap((response: AuthOk) => {
        this.setXsrfToken(response.xsrfToken);
      }),
      switchMap(() => this.loadMe()),
    );
  }

  logoutLocal(): void {
    this.clearSession();
    void this._router.navigate(['/auth']);
  }

  logout(): void {
    this._authHttp.logout$().subscribe({
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

  loadMe(): Observable<User | null> {
    if (this._loadMeInFlight$) {
      return this._loadMeInFlight$;
    }

    this._loadingMe.set(true);

    this._loadMeInFlight$ = this._authHttp.me$().pipe(
      tap((user: User) => {
        this._user.set(user);
        this._initialized.set(true);
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

    this._refreshSessionInFlight$ = this._authHttp.refresh$().pipe(
      tap((response: RefreshSessionResult) => {
        this.setXsrfToken(response.xsrfToken);
      }),
      switchMap(() => this.loadMe()),
      map(() => void 0),
      catchError((error: unknown) => {
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
}
