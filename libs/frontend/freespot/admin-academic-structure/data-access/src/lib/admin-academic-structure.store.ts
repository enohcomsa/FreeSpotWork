import { computed, inject, Injectable, Signal, signal } from '@angular/core';
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
import { HttpAdminAcademicStructureService } from './http-admin-academic-structure.service';

@Injectable({ providedIn: 'root' })
export class AdminAcademicStructureStore {
  private readonly api = inject(HttpAdminAcademicStructureService);

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
    this.api.load$().subscribe(({ faculties, subjects, programs, programYears, cohorts, rooms, timetableActivities, users }) => {
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

  getFacultyById(id: string): Signal<AdminFaculty | undefined> {
    return computed(() => this.facultiesSig().find((faculty) => faculty.id === id));
  }

  getSubjectById(id: string): Signal<AdminSubjectItem | undefined> {
    return computed(() => this.subjectsSig().find((subject) => subject.id === id));
  }

  getProgramById(id: string): Signal<AdminProgram | undefined> {
    return computed(() => this.programsSig().find((program) => program.id === id));
  }

  getProgramYearById(id: string): Signal<AdminProgramYear | undefined> {
    return computed(() => this.programYearsSig().find((year) => year.id === id));
  }

  getCohortById(id: string): Signal<AdminCohort | undefined> {
    return computed(() => this.cohortsSig().find((cohort) => cohort.id === id));
  }

  getRoomById(id: string): Signal<AdminAcademicRoom | undefined> {
    return computed(() => this.roomsSig().find((room) => room.id === id));
  }

  selectProgramsByFacultyId(facultyId: string): Signal<AdminProgram[]> {
    return computed(() => this.programsSig().filter((program) => program.facultyId === facultyId));
  }

  selectYearsByProgramId(programId: string): Signal<AdminProgramYear[]> {
    return computed(() => this.programYearsSig().filter((year) => year.programId === programId));
  }

  selectGroupsByProgramYearId(programYearId: string): Signal<AdminCohort[]> {
    return computed(() => this.cohortsSig().filter((cohort) => cohort.programYearId === programYearId && !cohort.parentGroupId));
  }

  selectSemigroupsByParentGroupId(parentGroupId: string): Signal<AdminCohort[]> {
    return computed(() => this.cohortsSig().filter((cohort) => cohort.parentGroupId === parentGroupId));
  }

  selectTimetableActivitiesByCohortId(cohortId: string): Signal<AdminAcademicTimetableActivity[]> {
    return computed(() => this.timetableActivitiesSig().filter((activity) => activity.cohortIds.includes(cohortId)));
  }

  updateFaculty(id: string, cmd: UpdateAdminFacultyCmd): void {
    this.api.updateFaculty$(id, cmd).subscribe((updatedFaculty) => {
      this.facultiesSig.update((faculties) => faculties.map((faculty) => (faculty.id === id ? updatedFaculty : faculty)));
    });
  }

  createProgram(cmd: CreateAdminProgramCmd): void {
    this.api.createProgram$(cmd).subscribe((program) => {
      this.programsSig.update((programs) => [...programs, program]);
    });
  }

  updateProgram(id: string, cmd: UpdateAdminProgramCmd): void {
    this.api.updateProgram$(id, cmd).subscribe((updatedProgram) => {
      this.programsSig.update((programs) => programs.map((program) => (program.id === id ? updatedProgram : program)));
    });
  }

  deleteProgram(id: string): void {
    this.api.deleteProgram$(id).subscribe(() => {
      this.programsSig.update((programs) => programs.filter((program) => program.id !== id));
    });
  }

  createProgramYear(cmd: CreateAdminProgramYearCmd): void {
    this.api.createProgramYear$(cmd).subscribe((programYear) => {
      this.programYearsSig.update((programYears) => [...programYears, programYear]);
    });
  }

  updateProgramYear(id: string, cmd: UpdateAdminProgramYearCmd): void {
    this.api.updateProgramYear$(id, cmd).subscribe((updatedProgramYear) => {
      this.programYearsSig.update((programYears) =>
        programYears.map((programYear) => (programYear.id === id ? updatedProgramYear : programYear)),
      );
    });
  }

  deleteProgramYear(id: string): void {
    this.api.deleteProgramYear$(id).subscribe(() => {
      this.programYearsSig.update((programYears) => programYears.filter((programYear) => programYear.id !== id));
    });
  }

  createCohort(cmd: CreateAdminCohortCmd): void {
    this.api.createCohort$(cmd).subscribe((cohort) => {
      this.cohortsSig.update((cohorts) => [...cohorts, cohort]);
    });
  }

  deleteCohort(id: string): void {
    this.api.deleteCohort$(id).subscribe(() => {
      this.cohortsSig.update((cohorts) => cohorts.filter((cohort) => cohort.id !== id));
    });
  }

  updateUser(id: string, cmd: UpdateAdminAcademicUserCmd): void {
    this.api.updateUser$(id, cmd).subscribe((updatedUser) => {
      this.usersSig.update((users) => users.map((user) => (user.id === id ? updatedUser : user)));
    });
  }
}
