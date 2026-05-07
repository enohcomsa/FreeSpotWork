import { inject, Injectable } from '@angular/core';
import { UserMeProfileUpdateDTO, UsersHttpService } from '@free-spot/api-client';
import { map, Observable } from 'rxjs';
import { type User } from '@free-spot/core/domain';
import { type UpdateMyProfileCmd } from '@free-spot/user-setup/domain';
import { authUserDtoToUser, toMyProfileUpdateDTO } from './user-setup.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpUserSetupService {
  private readonly _api = inject(UsersHttpService);

  updateMyProfile$(input: UpdateMyProfileCmd): Observable<User> {
    const dto: UserMeProfileUpdateDTO = toMyProfileUpdateDTO(input);

    return this._api.usersMeProfilePatch({ userMeProfileUpdateDTO: dto }).pipe(
      map(authUserDtoToUser),
    );
  }
}
