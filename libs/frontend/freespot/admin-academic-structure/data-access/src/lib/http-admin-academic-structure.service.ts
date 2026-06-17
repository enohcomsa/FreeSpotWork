import { inject, Injectable } from '@angular/core';
import {
  CohortsHttpService,
  FacultiesHttpService,
  ProgramYearsHttpService,
  ProgramsHttpService,
  RoomsHttpService,
  SubjectsHttpService,
  TimetableActivitiesHttpService,
  UsersHttpService,
} from '@free-spot/api-client';
import {
  type AdminAcademicRoom,
  type AdminAcademicTimetableActivity,
  type AdminAcademicUser,
  type AdminCohort,
  type AdminFaculty,
  type AdminProgram,
  type AdminProgramYear,
  type AdminSubjectItem,
  type CreateAdminCohortCmd,
  type CreateAdminProgramCmd,
  type CreateAdminProgramYearCmd,
  type UpdateAdminAcademicUserCmd,
  type UpdateAdminFacultyCmd,
  type UpdateAdminProgramCmd,
  type UpdateAdminProgramYearCmd,
} from '@free-spot/admin-academic-structure/domain';
import { forkJoin, map, Observable } from 'rxjs';
import {
  academicUserDtoToDomain,
  cohortDtoToDomain,
  createCohortCmdToDto,
  createProgramCmdToDto,
  createProgramYearCmdToDto,
  facultyDtoToDomain,
  programDtoToDomain,
  programYearDtoToDomain,
  subjectDtoToDomain,
  updateAcademicUserCmdToDto,
  updateFacultyCmdToDto,
  updateProgramCmdToDto,
  updateProgramYearCmdToDto,
} from './admin-academic-structure.dto.mapper';
import {
  roomDtoToDomain,
  timetableActivityDtoToDomain,
} from './admin-academic-structure-timetable.dto.mapper';

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
      faculties: this.listFaculties$(),
      subjects: this.listSubjects$(),
      programs: this.listPrograms$(),
      programYears: this.listProgramYears$(),
      cohorts: this.listCohorts$(),
      rooms: this.listRooms$(),
      timetableActivities: this.listTimetableActivities$(),
      users: this.listUsers$(),
    });
  }

  updateFaculty$(id: string, cmd: UpdateAdminFacultyCmd): Observable<AdminFaculty> {
    return this.facultiesApi
      .facultiesIdPatch({ id, facultyUpdateDTO: updateFacultyCmdToDto(cmd) })
      .pipe(map(facultyDtoToDomain));
  }

  createProgram$(cmd: CreateAdminProgramCmd): Observable<AdminProgram> {
    return this.programsApi
      .programsPost({ programCreateDTO: createProgramCmdToDto(cmd) })
      .pipe(map(programDtoToDomain));
  }

  updateProgram$(id: string, cmd: UpdateAdminProgramCmd): Observable<AdminProgram> {
    return this.programsApi
      .programsIdPatch({ id, programUpdateDTO: updateProgramCmdToDto(cmd) })
      .pipe(map(programDtoToDomain));
  }

  deleteProgram$(id: string): Observable<void> {
    return this.programsApi.programsIdDelete({ id }).pipe(map(() => void 0));
  }

  createProgramYear$(cmd: CreateAdminProgramYearCmd): Observable<AdminProgramYear> {
    return this.programYearsApi
      .programYearsPost({ programYearCreateDTO: createProgramYearCmdToDto(cmd) })
      .pipe(map(programYearDtoToDomain));
  }

  updateProgramYear$(id: string, cmd: UpdateAdminProgramYearCmd): Observable<AdminProgramYear> {
    return this.programYearsApi
      .programYearsIdPatch({ id, programYearUpdateDTO: updateProgramYearCmdToDto(cmd) })
      .pipe(map(programYearDtoToDomain));
  }

  deleteProgramYear$(id: string): Observable<void> {
    return this.programYearsApi.programYearsIdDelete({ id }).pipe(map(() => void 0));
  }

  createCohort$(cmd: CreateAdminCohortCmd): Observable<AdminCohort> {
    return this.cohortsApi
      .cohortsPost({ cohortCreateDTO: createCohortCmdToDto(cmd) })
      .pipe(map(cohortDtoToDomain));
  }

  deleteCohort$(id: string): Observable<void> {
    return this.cohortsApi.cohortsIdDelete({ id }).pipe(map(() => void 0));
  }

  updateUser$(id: string, cmd: UpdateAdminAcademicUserCmd): Observable<AdminAcademicUser> {
    return this.usersApi
      .usersIdPatch({
        id,
        userUpdateDTO: updateAcademicUserCmdToDto(cmd),
      })
      .pipe(map(academicUserDtoToDomain));
  }

  private listFaculties$(): Observable<AdminFaculty[]> {
    return this.facultiesApi.facultiesGet().pipe(
      map((dtos) => (dtos ?? []).map(facultyDtoToDomain))
    );
  }

  private listSubjects$(): Observable<AdminSubjectItem[]> {
    return this.subjectsApi.subjectsGet().pipe(
      map((dtos) => (dtos ?? []).map(subjectDtoToDomain))
    );
  }

  private listPrograms$(): Observable<AdminProgram[]> {
    return this.programsApi.programsGet().pipe(
      map((dtos) => (dtos ?? []).map(programDtoToDomain))
    );
  }

  private listProgramYears$(): Observable<AdminProgramYear[]> {
    return this.programYearsApi.programYearsGet().pipe(
      map((dtos) => (dtos ?? []).map(programYearDtoToDomain))
    );
  }

  private listCohorts$(): Observable<AdminCohort[]> {
    return this.cohortsApi.cohortsGet().pipe(
      map((dtos) => (dtos ?? []).map(cohortDtoToDomain))
    );
  }

  private listRooms$(): Observable<AdminAcademicRoom[]> {
    return this.roomsApi.roomsGet().pipe(
      map((dtos) => (dtos ?? []).map(roomDtoToDomain))
    );
  }

  private listTimetableActivities$(): Observable<AdminAcademicTimetableActivity[]> {
    return this.timetableActivitiesApi.timetableActivitiesGet().pipe(
      map((dtos) => (dtos ?? []).map(timetableActivityDtoToDomain))
    );
  }

  private listUsers$(): Observable<AdminAcademicUser[]> {
    return this.usersApi.usersGet().pipe(
      map((dtos) => (dtos ?? []).map(academicUserDtoToDomain))
    );
  }
}
