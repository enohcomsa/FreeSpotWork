import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { type AuthOk, type LoginCmd, type RefreshSessionResult, type SignupCmd, type User } from '@free-spot/core/domain';
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
import { HttpAuthService } from './http-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authHttp = inject(HttpAuthService);
  private readonly router = inject(Router);

  private readonly user = signal<User | null>(null);
  private readonly xsrfToken = signal<string | null>(null);
  private readonly initialized = signal(false);
  private readonly loadingMe = signal(false);

  private loadMeInFlight$: Observable<User | null> | null = null;
  private refreshSessionInFlight$: Observable<void> | null = null;

  readonly userSignal = this.user.asReadonly();
  readonly xsrfTokenSignal = this.xsrfToken.asReadonly();
  readonly initializedSignal = this.initialized.asReadonly();
  readonly loadingMeSignal = this.loadingMe.asReadonly();

  readonly isAuthenticated = computed<boolean>(() => !!this.user());
  readonly isAdmin = computed<boolean>(() => this.user()?.role === 'ADMIN');

  login(payload: LoginCmd): Observable<User | null> {
    return this.authHttp.login$(payload).pipe(
      tap((response: AuthOk) => {
        this.setXsrfToken(response.xsrfToken);
      }),
      switchMap(() => this.loadMe()),
    );
  }

  signup(payload: SignupCmd): Observable<User | null> {
    return this.authHttp.signup$(payload).pipe(
      tap((response: AuthOk) => {
        this.setXsrfToken(response.xsrfToken);
      }),
      switchMap(() => this.loadMe()),
    );
  }

  logoutLocal(): void {
    this.clearSession();
    void this.router.navigate(['/auth']);
  }

  logout(): void {
    this.authHttp.logout$().subscribe({
      next: () => {
        this.clearSession();
        void this.router.navigate(['/auth']);
      },
      error: () => {
        this.clearSession();
        void this.router.navigate(['/auth']);
      },
    });
  }

  loadMe(): Observable<User | null> {
    if (this.loadMeInFlight$) {
      return this.loadMeInFlight$;
    }

    this.loadingMe.set(true);

    this.loadMeInFlight$ = this.authHttp.me$().pipe(
      tap((user: User) => {
        this.user.set(user);
        this.initialized.set(true);
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      }),
      finalize(() => {
        this.loadingMe.set(false);
        this.loadMeInFlight$ = null;
      }),
      shareReplay(1),
    );

    return this.loadMeInFlight$;
  }

  refreshSession(): Observable<void> {
    if (this.refreshSessionInFlight$) {
      return this.refreshSessionInFlight$;
    }

    this.refreshSessionInFlight$ = this.authHttp.refresh$().pipe(
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
        this.refreshSessionInFlight$ = null;
      }),
      shareReplay(1),
    );

    return this.refreshSessionInFlight$;
  }

  setXsrfToken(token: string | null): void {
    this.xsrfToken.set(token);
  }

  clearSession(): void {
    this.user.set(null);
    this.xsrfToken.set(null);
    this.initialized.set(true);
  }
}
