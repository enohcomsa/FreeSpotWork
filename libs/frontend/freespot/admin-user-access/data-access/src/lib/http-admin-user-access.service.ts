import { inject, Injectable } from '@angular/core';
import { UsersHttpService } from '@free-spot/api-client';
import { type AdminUser } from '@free-spot/admin-user-access/domain';
import { map, Observable } from 'rxjs';
import { dtoToAdminUser, roleToDto } from './admin-user-access.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpAdminUserAccessService {
  private readonly api = inject(UsersHttpService);

  listUsers$(): Observable<AdminUser[]> {
    return this.api.usersGet().pipe(map((dtos) => (dtos ?? []).map(dtoToAdminUser)));
  }

  updateUserRole$(id: string, role: AdminUser['role']): Observable<void> {
    return this.api
      .usersIdPatch({
        id,
        userUpdateDTO: { role: roleToDto(role) },
      })
      .pipe(map(() => void 0));
  }
}
