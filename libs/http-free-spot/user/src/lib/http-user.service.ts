import { inject, Injectable } from '@angular/core';
import {
  UserMePreferencesUpdateDTO,
  UserMeProfileUpdateDTO,
  UserResponseDTO,
  UsersHttpService,
} from '@free-spot/api-client';
import { map, Observable } from 'rxjs';
import {
  UpdateMyPreferencesCmd,
  UpdateMyProfileCmd,
  UpdateUserCmd,
  User,
} from '@free-spot-domain/user';
import { dtoToDomain, toMyProfileUpdateDTO, toMyPreferencesUpdateDTO, toUpdateUserDTO } from './mappers/user.dto.mapper';

@Injectable({
  providedIn: 'root'
})
export class HttpUserService {
  private _api = inject(UsersHttpService);

  listUsers$(): Observable<User[]> {
    return this._api.usersGet().pipe(
      map((dtos: UserResponseDTO[]) => (dtos ?? []).map(dtoToDomain))
    );
  }

  getUserById$(id: string): Observable<User> {
    return this._api.usersIdGet({ id }).pipe(map(dtoToDomain));
  }

  updateMyProfile$(input: UpdateMyProfileCmd): Observable<User> {
    const dto: UserMeProfileUpdateDTO = toMyProfileUpdateDTO(input);
    return this._api.usersMeProfilePatch({ userMeProfileUpdateDTO: dto }).pipe(map(dtoToDomain));
  }

  updateMyPreferences$(input: UpdateMyPreferencesCmd): Observable<User> {
    const dto: UserMePreferencesUpdateDTO = toMyPreferencesUpdateDTO(input);
    return this._api.usersMePreferencesPatch({ userMePreferencesUpdateDTO: dto }).pipe(map(dtoToDomain));
  }

  updateUser$(id: string, patch: UpdateUserCmd): Observable<User> {
    return this._api.usersIdPatch({ id, userUpdateDTO: toUpdateUserDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteUser$(id: string): Observable<void> {
    return this._api.usersIdDelete({ id }).pipe(map(() => void 0));
  }
}
