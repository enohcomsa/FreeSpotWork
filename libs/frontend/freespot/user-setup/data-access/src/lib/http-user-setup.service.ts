import { inject, Injectable } from '@angular/core';
import {
  CohortsHttpService,
  FacultiesHttpService,
  ProgramsHttpService,
  ProgramYearsHttpService,
  UsersHttpService,
} from '@free-spot/api-client';
import { type User } from '@free-spot/core/domain';
import {
  type UpdateMyProfileCmd,
  type UserSetupCohort,
  type UserSetupFaculty,
  type UserSetupProgram,
  type UserSetupProgramYear,
} from '@free-spot/user-setup/domain';
import { forkJoin, map, Observable } from 'rxjs';
import {
  authUserDtoToUser,
  cohortDtoToDomain,
  facultyDtoToDomain,
  programDtoToDomain,
  programYearDtoToDomain,
  updateMyProfileCmdToDto,
} from './user-setup.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpUserSetupService {
  private readonly usersApi = inject(UsersHttpService);
  private readonly facultiesApi = inject(FacultiesHttpService);
  private readonly programsApi = inject(ProgramsHttpService);
  private readonly programYearsApi = inject(ProgramYearsHttpService);
  private readonly cohortsApi = inject(CohortsHttpService);

  loadSetupData$(): Observable<{
    faculties: UserSetupFaculty[];
    programs: UserSetupProgram[];
    programYears: UserSetupProgramYear[];
    cohorts: UserSetupCohort[];
  }> {
    return forkJoin({
      faculties: this.listFaculties$(),
      programs: this.listPrograms$(),
      programYears: this.listProgramYears$(),
      cohorts: this.listCohorts$(),
    });
  }

  updateMyProfile$(input: UpdateMyProfileCmd): Observable<User> {
    return this.usersApi
      .usersMeProfilePatch({
        userMeProfileUpdateDTO: updateMyProfileCmdToDto(input),
      })
      .pipe(map(authUserDtoToUser));
  }

  private listFaculties$(): Observable<UserSetupFaculty[]> {
    return this.facultiesApi.facultiesGet().pipe(map((dtos) => (dtos ?? []).map(facultyDtoToDomain)));
  }

  private listPrograms$(): Observable<UserSetupProgram[]> {
    return this.programsApi.programsGet().pipe(map((dtos) => (dtos ?? []).map(programDtoToDomain)));
  }

  private listProgramYears$(): Observable<UserSetupProgramYear[]> {
    return this.programYearsApi.programYearsGet().pipe(map((dtos) => (dtos ?? []).map(programYearDtoToDomain)));
  }

  private listCohorts$(): Observable<UserSetupCohort[]> {
    return this.cohortsApi.cohortsGet().pipe(map((dtos) => (dtos ?? []).map(cohortDtoToDomain)));
  }
}
