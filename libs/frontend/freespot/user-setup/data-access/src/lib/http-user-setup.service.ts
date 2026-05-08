import { inject, Injectable } from '@angular/core';
import {
  CohortsHttpService,
  FacultiesHttpService,
  ProgramsHttpService,
  ProgramYearsHttpService,
  type UserMeProfileUpdateDTO,
  UsersHttpService,
} from '@free-spot/api-client';
import { forkJoin, map, Observable } from 'rxjs';
import { type User } from '@free-spot/core/domain';
import {
  type UpdateMyProfileCmd,
  type UserSetupCohort,
  type UserSetupFaculty,
  type UserSetupProgram,
  type UserSetupProgramYear,
} from '@free-spot/user-setup/domain';
import {
  authUserDtoToUser,
  dtoToUserSetupCohort,
  dtoToUserSetupFaculty,
  dtoToUserSetupProgram,
  dtoToUserSetupProgramYear,
  toMyProfileUpdateDTO,
} from './user-setup.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpUserSetupService {
  private readonly _usersApi = inject(UsersHttpService);
  private readonly _facultiesApi = inject(FacultiesHttpService);
  private readonly _programsApi = inject(ProgramsHttpService);
  private readonly _programYearsApi = inject(ProgramYearsHttpService);
  private readonly _cohortsApi = inject(CohortsHttpService);

  loadSetupData$(): Observable<{
    faculties: UserSetupFaculty[];
    programs: UserSetupProgram[];
    programYears: UserSetupProgramYear[];
    cohorts: UserSetupCohort[];
  }> {
    return forkJoin({
      faculties: this._facultiesApi.facultiesGet().pipe(map((dtos) => (dtos ?? []).map(dtoToUserSetupFaculty))),
      programs: this._programsApi.programsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToUserSetupProgram))),
      programYears: this._programYearsApi.programYearsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToUserSetupProgramYear))),
      cohorts: this._cohortsApi.cohortsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToUserSetupCohort))),
    });
  }

  updateMyProfile$(input: UpdateMyProfileCmd): Observable<User> {
    const userMeProfileUpdateDTO: UserMeProfileUpdateDTO = toMyProfileUpdateDTO(input);

    return this._usersApi.usersMeProfilePatch({ userMeProfileUpdateDTO }).pipe(map(authUserDtoToUser));
  }
}
