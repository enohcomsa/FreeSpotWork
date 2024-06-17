import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, UserData } from './models/auth.model';
import { User } from './models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  userSignal$: WritableSignal<User | null> = signal(null);

  signUp(user: UserData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA977pOtBh69mOV1wna0adyXcszT7uffYs',
        {
          email: user.email,
          password: user.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((res) => {
          this._handleAuth(res.email, res.localId, res.idToken, +res.expiresIn);
        })
      );
  }

  logIn(user: UserData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA977pOtBh69mOV1wna0adyXcszT7uffYs',
        {
          email: user.email,
          password: user.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((res) => {
          this._handleAuth(res.email, res.localId, res.idToken, +res.expiresIn);
        })
      );
  }

  autoLogIn(): void {
    const user: { email: string; id: string; _token: string; _tokenExpirationDate: Date } = JSON.parse(
      localStorage.getItem('user') as string
    );
    if (!user) {
      return;
    }
    const loadedUser: User = new User(user.email, user.id, user._token, new Date(user._tokenExpirationDate));
    if (loadedUser.token) {
      this.userSignal$.set(loadedUser);
    }
  }

  logOut(): void {
    this.userSignal$.set(null);
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  // to do some auto logout logic
  // autoLogOut(expirationDuratoin: number): void {
  //   setTimeout(() => {
  //     this.logOut();
  //   }, expirationDuratoin);
  // }

  private _handleAuth(email: string, localId: string, idToken: string, expiresIn: number) {
    const exirationDate: Date = new Date(new Date().getTime() + expiresIn * 1000);
    const user: User = new User(email, localId, idToken, exirationDate);
    this.userSignal$.set(user);

    localStorage.setItem('user', JSON.stringify(user));
  }
}
