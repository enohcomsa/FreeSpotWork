import { inject, Injectable } from '@angular/core';
import { UserMePreferencesUpdateDTO, UsersHttpService } from '@free-spot/api-client';
import { map, Observable } from 'rxjs';
import { UpdateMyPreferencesCmd } from '@free-spot/core/domain';
import { toMyPreferencesUpdateDTO } from './user-preferences.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpUserPreferencesService {
  private readonly api = inject(UsersHttpService);

  updateMyPreferences$(input: UpdateMyPreferencesCmd): Observable<void> {
    const dto: UserMePreferencesUpdateDTO = toMyPreferencesUpdateDTO(input);

    return this.api
      .usersMePreferencesPatch({ userMePreferencesUpdateDTO: dto })
      .pipe(map(() => void 0));
  }
}
