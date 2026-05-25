import { inject, Injectable } from '@angular/core';
import {
  CohortsHttpService,
  FacultiesHttpService,
  ProgramYearsHttpService,
  ProgramsHttpService,
  SubjectsHttpService,
  RoomsHttpService,
  TimetableActivitiesHttpService,
  UsersHttpService,
} from '@free-spot/api-client';
import { forkJoin, map, Observable } from 'rxjs';

import {
  AdminCohort,
  AdminFaculty,
  AdminProgram,
  AdminProgramYear,
  AdminSubjectItem,
  CreateAdminCohortCmd,
  CreateAdminProgramCmd,
  CreateAdminProgramYearCmd,
  UpdateAdminFacultyCmd,
  UpdateAdminProgramCmd,
  UpdateAdminProgramYearCmd,
  AdminAcademicRoom,
  AdminAcademicTimetableActivity,
  AdminAcademicUser,
  UpdateAdminAcademicUserCmd,
} from '@free-spot/admin-academic-structure/domain';

import {
  mapAdminCohortDtoToDomain,
  mapAdminFacultyDtoToDomain,
  mapAdminProgramDtoToDomain,
  mapAdminProgramYearDtoToDomain,
  mapAdminSubjectDtoToDomain,
  mapCreateAdminCohortCmdToDto,
  mapCreateAdminProgramCmdToDto,
  mapCreateAdminProgramYearCmdToDto,
  mapUpdateAdminFacultyCmdToDto,
  mapUpdateAdminProgramCmdToDto,
  mapUpdateAdminProgramYearCmdToDto,
  mapAdminAcademicRoomDtoToDomain,
  mapAdminAcademicTimetableActivityDtoToDomain,
  mapAdminAcademicUserDtoToDomain,
  mapUpdateAdminAcademicUserCmdToDto,
} from './admin-academic-structure.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpAdminAcademicStructureService {
  private readonly facultiesApi = inject(FacultiesHttpService);
  private readonly subjectsApi = inject(SubjectsHttpService);
  private readonly programsApi = inject(ProgramsHttpService);
  private readonly programYearsApi = inject(ProgramYearsHttpService);
  private readonly cohortsApi = inject(CohortsHttpService);
  private readonly roomsApi = inject(RoomsHttpService);
  private readonly timetableActivitiesApi = inject(TimetableActivitiesHttpService);
  private readonly usersApi = inject(UsersHttpService);

  load$(): Observable<{
    faculties: AdminFaculty[];
    subjects: AdminSubjectItem[];
    programs: AdminProgram[];
    programYears: AdminProgramYear[];
    cohorts: AdminCohort[];
    rooms: AdminAcademicRoom[];
    timetableActivities: AdminAcademicTimetableActivity[];
    users: AdminAcademicUser[];
  }> {
    return forkJoin({
      faculties: this.facultiesApi.facultiesGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminFacultyDtoToDomain)),
      ),
      subjects: this.subjectsApi.subjectsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminSubjectDtoToDomain)),
      ),
      programs: this.programsApi.programsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminProgramDtoToDomain)),
      ),
      programYears: this.programYearsApi.programYearsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminProgramYearDtoToDomain)),
      ),
      cohorts: this.cohortsApi.cohortsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminCohortDtoToDomain)),
      ),
      rooms: this.roomsApi.roomsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminAcademicRoomDtoToDomain)),
      ),
      timetableActivities: this.timetableActivitiesApi.timetableActivitiesGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminAcademicTimetableActivityDtoToDomain)),
      ),
      users: this.usersApi.usersGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminAcademicUserDtoToDomain)),
      ),
    });
  }

  updateFaculty$(id: string, cmd: UpdateAdminFacultyCmd): Observable<AdminFaculty> {
    return this.facultiesApi
      .facultiesIdPatch({ id, facultyUpdateDTO: mapUpdateAdminFacultyCmdToDto(cmd) })
      .pipe(map(mapAdminFacultyDtoToDomain));
  }

  createProgram$(cmd: CreateAdminProgramCmd): Observable<AdminProgram> {
    return this.programsApi
      .programsPost({ programCreateDTO: mapCreateAdminProgramCmdToDto(cmd) })
      .pipe(map(mapAdminProgramDtoToDomain));
  }

  updateProgram$(id: string, cmd: UpdateAdminProgramCmd): Observable<AdminProgram> {
    return this.programsApi
      .programsIdPatch({ id, programUpdateDTO: mapUpdateAdminProgramCmdToDto(cmd) })
      .pipe(map(mapAdminProgramDtoToDomain));
  }

  deleteProgram$(id: string): Observable<void> {
    return this.programsApi.programsIdDelete({ id }).pipe(map(() => undefined));
  }

  createProgramYear$(cmd: CreateAdminProgramYearCmd): Observable<AdminProgramYear> {
    return this.programYearsApi
      .programYearsPost({ programYearCreateDTO: mapCreateAdminProgramYearCmdToDto(cmd) })
      .pipe(map(mapAdminProgramYearDtoToDomain));
  }

  updateProgramYear$(id: string, cmd: UpdateAdminProgramYearCmd): Observable<AdminProgramYear> {
    return this.programYearsApi
      .programYearsIdPatch({ id, programYearUpdateDTO: mapUpdateAdminProgramYearCmdToDto(cmd) })
      .pipe(map(mapAdminProgramYearDtoToDomain));
  }

  deleteProgramYear$(id: string): Observable<void> {
    return this.programYearsApi.programYearsIdDelete({ id }).pipe(map(() => undefined));
  }

  createCohort$(cmd: CreateAdminCohortCmd): Observable<AdminCohort> {
    return this.cohortsApi
      .cohortsPost({ cohortCreateDTO: mapCreateAdminCohortCmdToDto(cmd) })
      .pipe(map(mapAdminCohortDtoToDomain));
  }

  deleteCohort$(id: string): Observable<void> {
    return this.cohortsApi.cohortsIdDelete({ id }).pipe(map(() => undefined));
  }

  updateUser$(id: string, cmd: UpdateAdminAcademicUserCmd): Observable<AdminAcademicUser> {
    return this.usersApi
      .usersIdPatch({
        id,
        userUpdateDTO: mapUpdateAdminAcademicUserCmdToDto(cmd),
      })
      .pipe(map(mapAdminAcademicUserDtoToDomain));
  }
}
