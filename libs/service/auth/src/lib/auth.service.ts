import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthUser } from './models/auth-user.model';
import { AuthResponse, UserData } from './models/auth.model';
import { HttpUserService } from '@http-free-spot/user';
// import { AppUser } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http: HttpClient = inject(HttpClient);
  private _router: Router = inject(Router);
  private _userHttpService: HttpUserService = inject(HttpUserService);

  userSignal$: WritableSignal<AuthUser | null> = signal(null);

  signUp(user: UserData): Observable<AuthResponse> {
    return this._http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA977pOtBh69mOV1wna0adyXcszT7uffYs',
        {
          email: user.email,
          password: user.password,
          returnSecureToken: true,
        },
      )
      .pipe(
        tap((res: AuthResponse) => {
          this._handleAuth(res.email, res.localId, res.idToken, +res.expiresIn);
          this._addUser(res.email);
        }),
      );
  }

  logIn(user: UserData): Observable<AuthResponse> {
    return this._http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA977pOtBh69mOV1wna0adyXcszT7uffYs',
        {
          email: user.email,
          password: user.password,
          returnSecureToken: true,
        },
      )
      .pipe(
        tap((res: AuthResponse) => {
          this._handleAuth(res.email, res.localId, res.idToken, +res.expiresIn);
        }),
      );
  }

  autoLogIn(): void {
    const user: { email: string; id: string; _token: string; _tokenExpirationDate: Date } = JSON.parse(
      localStorage.getItem('user') as string,
    );
    if (!user) {
      return;
    }
    const loadedUser: AuthUser = new AuthUser(user.email, user.id, user._token, new Date(user._tokenExpirationDate));
    if (loadedUser.token) {
      this.userSignal$.set(loadedUser);
    }
  }

  logOut(): void {
    this.userSignal$.set(null);
    localStorage.clear();
    this._router.navigate(['/auth']);
  }

  // to do some auto logout logic
  // autoLogOut(expirationDuratoin: number): void {
  //   setTimeout(() => {
  //     this.logOut();
  //   }, expirationDuratoin);
  // }

  private _handleAuth(email: string, localId: string, idToken: string, expiresIn: number) {
    const exirationDate: Date = new Date(new Date().getTime() + expiresIn * 1000);
    const user: AuthUser = new AuthUser(email, localId, idToken, exirationDate);
    this.userSignal$.set(user);

    localStorage.setItem('user', JSON.stringify(user));
  }

  private _addUser(email: string): void {
    this._http
      .get<string[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/userList/.json')
      .pipe(
        tap((userList: string[] | undefined) => {
          const allUsers: string[] = userList || [];
          allUsers.push(email);
          this._userHttpService.storeUsers(allUsers);
        }),
      )
      .subscribe();
  }
}
