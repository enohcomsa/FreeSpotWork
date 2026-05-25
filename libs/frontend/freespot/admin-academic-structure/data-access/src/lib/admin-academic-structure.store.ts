import { Injectable, Signal, computed, inject, signal } from '@angular/core';

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

import { HttpAdminAcademicStructureService } from './http-admin-academic-structure.service';

@Injectable({ providedIn: 'root' })
export class AdminAcademicStructureStore {
  private readonly http = inject(HttpAdminAcademicStructureService);

  private readonly facultiesSig = signal<AdminFaculty[]>([]);
  private readonly subjectsSig = signal<AdminSubjectItem[]>([]);
  private readonly programsSig = signal<AdminProgram[]>([]);
  private readonly programYearsSig = signal<AdminProgramYear[]>([]);
  private readonly cohortsSig = signal<AdminCohort[]>([]);
  private readonly roomsSig = signal<AdminAcademicRoom[]>([]);
  private readonly timetableActivitiesSig = signal<AdminAcademicTimetableActivity[]>([]);
  private readonly usersSig = signal<AdminAcademicUser[]>([]);

  readonly facultyListSig: Signal<AdminFaculty[]> = this.facultiesSig.asReadonly();
  readonly subjectListSig: Signal<AdminSubjectItem[]> = this.subjectsSig.asReadonly();
  readonly userListSig: Signal<AdminAcademicUser[]> = this.usersSig.asReadonly();

  init(): void {
    this.http.load$().subscribe(({ faculties, subjects, programs, programYears, cohorts, rooms, timetableActivities, users }) => {
      this.facultiesSig.set(faculties);
      this.subjectsSig.set(subjects);
      this.programsSig.set(programs);
      this.programYearsSig.set(programYears);
      this.cohortsSig.set(cohorts);
      this.roomsSig.set(rooms);
      this.timetableActivitiesSig.set(timetableActivities);
      this.usersSig.set(users);
    });
  }

  getFacultyById(id: string) {
    return computed(() => this.facultiesSig().find((faculty) => faculty.id === id));
  }

  getSubjectById(id: string) {
    return computed(() => this.subjectsSig().find((subject) => subject.id === id));
  }

  getProgramById(id: string) {
    return computed(() => this.programsSig().find((program) => program.id === id));
  }

  getProgramYearById(id: string) {
    return computed(() => this.programYearsSig().find((year) => year.id === id));
  }

  getCohortById(id: string) {
    return computed(() => this.cohortsSig().find((cohort) => cohort.id === id));
  }

  selectProgramsByFacultyId(facultyId: string) {
    return computed(() => this.programsSig().filter((program) => program.facultyId === facultyId));
  }

  selectYearsByProgramId(programId: string) {
    return computed(() => this.programYearsSig().filter((year) => year.programId === programId));
  }

  selectGroupsByProgramYearId(programYearId: string) {
    return computed(() =>
      this.cohortsSig().filter((cohort) => cohort.programYearId === programYearId),
    );
  }

  selectSemigroupsByParentGroupId(parentGroupId: string) {
    return computed(() =>
      this.cohortsSig().filter((cohort) => cohort.parentGroupId === parentGroupId),
    );
  }

  updateFaculty(id: string, cmd: UpdateAdminFacultyCmd): void {
    this.http.updateFaculty$(id, cmd).subscribe((updatedFaculty) => {
      this.facultiesSig.update((faculties) =>
        faculties.map((faculty) => (faculty.id === id ? updatedFaculty : faculty)),
      );
    });
  }

  createProgram(cmd: CreateAdminProgramCmd): void {
    this.http.createProgram$(cmd).subscribe((program) => {
      this.programsSig.update((programs) => [...programs, program]);
    });
  }

  updateProgram(id: string, cmd: UpdateAdminProgramCmd): void {
    this.http.updateProgram$(id, cmd).subscribe((updatedProgram) => {
      this.programsSig.update((programs) =>
        programs.map((program) => (program.id === id ? updatedProgram : program)),
      );
    });
  }

  deleteProgram(id: string): void {
    this.http.deleteProgram$(id).subscribe(() => {
      this.programsSig.update((programs) => programs.filter((program) => program.id !== id));
    });
  }

  createProgramYear(cmd: CreateAdminProgramYearCmd): void {
    this.http.createProgramYear$(cmd).subscribe((programYear) => {
      this.programYearsSig.update((programYears) => [...programYears, programYear]);
    });
  }

  updateProgramYear(id: string, cmd: UpdateAdminProgramYearCmd): void {
    this.http.updateProgramYear$(id, cmd).subscribe((updatedProgramYear) => {
      this.programYearsSig.update((programYears) =>
        programYears.map((programYear) =>
          programYear.id === id ? updatedProgramYear : programYear,
        ),
      );
    });
  }

  deleteProgramYear(id: string): void {
    this.http.deleteProgramYear$(id).subscribe(() => {
      this.programYearsSig.update((programYears) =>
        programYears.filter((programYear) => programYear.id !== id),
      );
    });
  }

  createCohort(cmd: CreateAdminCohortCmd): void {
    this.http.createCohort$(cmd).subscribe((cohort) => {
      this.cohortsSig.update((cohorts) => [...cohorts, cohort]);
    });
  }

  deleteCohort(id: string): void {
    this.http.deleteCohort$(id).subscribe(() => {
      this.cohortsSig.update((cohorts) => cohorts.filter((cohort) => cohort.id !== id));
    });
  }
  getRoomById(id: string) {
    return computed(() => this.roomsSig().find((room) => room.id === id));
  }

  selectTimetableActivitiesByCohortId(cohortId: string) {
    return computed(() =>
      this.timetableActivitiesSig().filter((activity) => activity.cohortIds.includes(cohortId)),
    );
  }

  updateUser(id: string, cmd: UpdateAdminAcademicUserCmd): void {
    this.http.updateUser$(id, cmd).subscribe((updatedUser) => {
      this.usersSig.update((users) =>
        users.map((user) => (user.id === id ? updatedUser : user)),
      );
    });
  }
}
