import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '@free-spot/core/data-access';
import {
  type UpdateMyProfileCmd,
  type UserSetupCohort,
  type UserSetupFaculty,
  type UserSetupProgram,
  type UserSetupProgramYear,
} from '@free-spot/user-setup/domain';
import { switchMap, take } from 'rxjs';
import { HttpUserSetupService } from './http-user-setup.service';

@Injectable({ providedIn: 'root' })
export class UserSetupStore {
  private readonly authService = inject(AuthService);
  private readonly api = inject(HttpUserSetupService);

  private readonly facultyListSigInternal = signal<UserSetupFaculty[]>([]);
  private readonly programListSig = signal<UserSetupProgram[]>([]);
  private readonly programYearListSig = signal<UserSetupProgramYear[]>([]);
  private readonly cohortListSig = signal<UserSetupCohort[]>([]);

  readonly facultyListSig = this.facultyListSigInternal.asReadonly();
  readonly foundProgramListSig = signal<UserSetupProgram[]>([]);
  readonly foundYearListSig = signal<UserSetupProgramYear[]>([]);
  readonly foundGroupListSig = signal<UserSetupCohort[]>([]);
  readonly foundSemigroupListSig = signal<UserSetupCohort[]>([]);

  readonly shouldOpenDialogSig = computed<boolean>(() => {
    const initialized = this.authService.initializedSignal();
    const user = this.authService.userSignal();

    if (!initialized || !user) {
      return false;
    }

    return (
      !user.firstName ||
      !user.familyName ||
      !user.facultyId ||
      !user.programId ||
      !user.programYearId ||
      !user.groupCohortId
    );
  });

  init(): void {
    if (this.facultyListSigInternal().length) {
      return;
    }

    this.api
      .loadSetupData$()
      .pipe(take(1))
      .subscribe(({ faculties, programs, programYears, cohorts }) => {
        this.facultyListSigInternal.set(faculties);
        this.programListSig.set(programs);
        this.programYearListSig.set(programYears);
        this.cohortListSig.set(cohorts);
      });
  }

  getCurrentUser() {
    return this.authService.userSignal();
  }

  onFacultySelected(faculty: UserSetupFaculty): void {
    this.foundProgramListSig.set(this.programListSig().filter((program) => program.facultyId === faculty.id));
    this.foundYearListSig.set([]);
    this.foundGroupListSig.set([]);
    this.foundSemigroupListSig.set([]);
  }

  onProgramSelected(program: UserSetupProgram): void {
    this.foundYearListSig.set(this.programYearListSig().filter((year) => year.programId === program.id));
    this.foundGroupListSig.set([]);
    this.foundSemigroupListSig.set([]);
  }

  onProgramYearSelected(programYear: UserSetupProgramYear): void {
    this.foundGroupListSig.set(
      this.cohortListSig().filter((cohort) => cohort.programYearId === programYear.id && !cohort.parentGroupId),
    );
    this.foundSemigroupListSig.set([]);
  }

  onGroupSelected(group: UserSetupCohort): void {
    this.foundSemigroupListSig.set(this.cohortListSig().filter((cohort) => cohort.parentGroupId === group.id));
  }

  preloadDependentLists(): void {
    const currentUser = this.authService.userSignal();

    if (!currentUser) {
      return;
    }

    if (currentUser.programId) {
      const program = this.programListSig().find((item) => item.id === currentUser.programId);

      if (program) {
        this.foundProgramListSig.set(this.programListSig().filter((item) => item.facultyId === program.facultyId));
      }
    }

    if (currentUser.programYearId) {
      const year = this.programYearListSig().find((item) => item.id === currentUser.programYearId);

      if (year) {
        this.foundYearListSig.set(this.programYearListSig().filter((item) => item.programId === year.programId));
      }
    }

    if (currentUser.groupCohortId) {
      const group = this.cohortListSig().find((item) => item.id === currentUser.groupCohortId);

      if (group) {
        this.foundGroupListSig.set(
          this.cohortListSig().filter((item) => item.programYearId === group.programYearId && !item.parentGroupId),
        );
      }
    }

    if (currentUser.semigroupCohortId) {
      const semigroup = this.cohortListSig().find((item) => item.id === currentUser.semigroupCohortId);

      if (semigroup?.parentGroupId) {
        this.foundSemigroupListSig.set(
          this.cohortListSig().filter((item) => item.parentGroupId === semigroup.parentGroupId),
        );
      }
    }
  }

  submit(input: UpdateMyProfileCmd, onSuccess: () => void): void {
    this.api
      .updateMyProfile$(input)
      .pipe(
        switchMap(() => this.authService.loadMe()),
        take(1),
      )
      .subscribe({
        next: () => {
          onSuccess();
        },
      });
  }
}
