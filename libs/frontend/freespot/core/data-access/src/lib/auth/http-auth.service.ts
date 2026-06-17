import { inject, Injectable } from '@angular/core';
import { AuthHttpService } from '@free-spot/api-client';
import { Observable, map } from 'rxjs';
import { Language, Theme, User, Role, AuthOk, LoginCmd, RefreshSessionResult, SignupCmd } from '@free-spot/core/domain';

@Injectable({ providedIn: 'root' })
export class HttpAuthService {
  private readonly _api = inject(AuthHttpService);

  login$(input: LoginCmd): Observable<AuthOk> {
    return this._api.authLogin({ loginRequestDTO: input }).pipe(
      map((res) => ({ xsrfToken: res.xsrfToken ?? null })),
    );
  }

  signup$(input: SignupCmd): Observable<AuthOk> {
    return this._api.authSignup({ signupRequestDTO: input }).pipe(
      map((res) => ({ xsrfToken: res.xsrfToken ?? null })),
    );
  }

  logout$(): Observable<void> {
    return this._api.authLogout({ body: {} }).pipe(
      map(() => void 0),
    );
  }

  refresh$(): Observable<RefreshSessionResult> {
    return this._api.authRefresh({ body: {} }).pipe(
      map((res) => ({ xsrfToken: res.xsrfToken ?? null })),
    );
  }

  me$(): Observable<User> {
    return this._api.authMe().pipe(
      map((dto) => ({
        id: dto.user.id,
        email: dto.user.email,
        firstName: dto.user.firstName,
        familyName: dto.user.familyName,
        role: dto.user.role as unknown as Role,
        preferredLanguage: dto.user.preferredLanguage as unknown as Language,
        preferredTheme: dto.user.preferredTheme as unknown as Theme,
        facultyId: dto.user.facultyId,
        programId: dto.user.programId,
        programYearId: dto.user.programYearId,
        groupCohortId: dto.user.groupCohortId,
        semigroupCohortId: dto.user.semigroupCohortId ?? null,
      })),
    );
  }
}
