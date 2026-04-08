import { inject, Injectable } from '@angular/core';
import { AuthHttpService as ApiAuthHttpService } from '@free-spot/api-client';
import { Observable, map } from 'rxjs';
import {
  AuthOk,
  LoginCmd,
  RefreshSessionResult,
  SignupCmd,
} from '@free-spot-domain/auth';
import { User } from '@free-spot-domain/user';
import {
  authOkDtoToDomain,
  meDtoToDomain,
  refreshDtoToDomain,
  toLoginDTO,
  toSignupDTO,
} from './mappers/auth.dto.mapper';

@Injectable({
  providedIn: 'root',
})
export class HttpAuthService {
  private readonly _api = inject(ApiAuthHttpService);

  login$(input: LoginCmd): Observable<AuthOk> {
    return this._api.authLogin({ loginRequestDTO: toLoginDTO(input) }).pipe(
      map(authOkDtoToDomain),
    );
  }

  signup$(input: SignupCmd): Observable<AuthOk> {
    return this._api.authSignup({ signupRequestDTO: toSignupDTO(input) }).pipe(
      map(authOkDtoToDomain),
    );
  }

  logout$(): Observable<void> {
    return this._api.authLogout({ body: {} }).pipe(
      map(() => void 0),
    );
  }

  me$(): Observable<User> {
    return this._api.authMe().pipe(
      map(meDtoToDomain),
    );
  }

  refresh$(): Observable<RefreshSessionResult> {
    return this._api.authRefresh({ body: {} }).pipe(
      map(refreshDtoToDomain),
    );
  }
}
