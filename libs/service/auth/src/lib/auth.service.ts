import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { AuthHttpService } from '@free-spot/api-client';
import { AuthOkResponseDTO } from '@free-spot/api-client';
import { LoginRequestDTO } from '@free-spot/api-client';
import { SignupRequestDTO } from '@free-spot/api-client';
import { AuthUser } from './models/auth-user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authHttp = inject(AuthHttpService);

  private _router = inject(Router);
  private _user = signal<AuthUser | null>(null);
  private _initialized = signal(false);
  private _loadingMe = signal(false);

  userSignal$ = this._user.asReadonly();
  initializedSignal$ = this._initialized.asReadonly();
  loadingMeSignal$ = this._loadingMe.asReadonly();

  isAuthenticated = computed(() => !!this._user());
  isAdmin = computed(() => this._user()?.role === 'ADMIN');

  login(payload: LoginRequestDTO): Observable<AuthOkResponseDTO> {
    return this._authHttp.authLogin({ loginRequestDTO: payload }).pipe(
      tap((response) => {
        this._setUserFromResponse(response);
      }),
    );
  }

  signup(payload: SignupRequestDTO): Observable<AuthOkResponseDTO> {
    return this._authHttp.authSignup({ signupRequestDTO: payload }).pipe(
      tap((response) => {
        this._setUserFromResponse(response);
      }),
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
      tap((response) => {
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
    console.log(response);

    if (!response.user?.id || !response.user.email || !response.user.role) {
      this.clearSession();
      return;
    }

    this._user.set({
      id: response.user.id,
      email: response.user.email,
      role: response.user.role,
    });
    this._initialized.set(true);
  }
}
