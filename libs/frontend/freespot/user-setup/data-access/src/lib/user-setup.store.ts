import { computed, inject, Injectable, signal } from '@angular/core';
import { take, switchMap } from 'rxjs';

import { AuthService } from '@free-spot/core/data-access';
import {
  type UpdateMyProfileCmd,
  type UserSetupCohort,
  type UserSetupFaculty,
  type UserSetupProgram,
  type UserSetupProgramYear,
} from '@free-spot/user-setup/domain';
import { HttpUserSetupService } from './http-user-setup.service';

@Injectable({ providedIn: 'root' })
export class UserSetupStore {
  private readonly _authService = inject(AuthService);
  private readonly _api = inject(HttpUserSetupService);

  private readonly _facultyListSig = signal<UserSetupFaculty[]>([]);
  private readonly _programListSig = signal<UserSetupProgram[]>([]);
  private readonly _programYearListSig = signal<UserSetupProgramYear[]>([]);
  private readonly _cohortListSig = signal<UserSetupCohort[]>([]);

  readonly facultyListSig = this._facultyListSig.asReadonly();
  readonly foundProgramListSig = signal<UserSetupProgram[]>([]);
  readonly foundYearListSig = signal<UserSetupProgramYear[]>([]);
  readonly foundGroupListSig = signal<UserSetupCohort[]>([]);
  readonly foundSemigroupListSig = signal<UserSetupCohort[]>([]);

  readonly shouldOpenDialogSig = computed(() => {
    const initialized = this._authService.initializedSignal();
    const user = this._authService.userSignal();

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
    if (this._facultyListSig().length) {
      return;
    }

    this._api
      .loadSetupData$()
      .pipe(take(1))
      .subscribe(({ faculties, programs, programYears, cohorts }) => {
        this._facultyListSig.set(faculties);
        this._programListSig.set(programs);
        this._programYearListSig.set(programYears);
        this._cohortListSig.set(cohorts);
      });
  }

  getCurrentUser() {
    return this._authService.userSignal();
  }

  onFacultySelected(faculty: UserSetupFaculty): void {
    this.foundProgramListSig.set(this._programListSig().filter((program) => program.facultyId === faculty.id));
    this.foundYearListSig.set([]);
    this.foundGroupListSig.set([]);
    this.foundSemigroupListSig.set([]);
  }

  onProgramSelected(program: UserSetupProgram): void {
    this.foundYearListSig.set(this._programYearListSig().filter((year) => year.programId === program.id));
    this.foundGroupListSig.set([]);
    this.foundSemigroupListSig.set([]);
  }

  onProgramYearSelected(programYear: UserSetupProgramYear): void {
    this.foundGroupListSig.set(
      this._cohortListSig().filter((cohort) => cohort.programYearId === programYear.id && !cohort.parentGroupId)
    );
    this.foundSemigroupListSig.set([]);
  }

  onGroupSelected(group: UserSetupCohort): void {
    this.foundSemigroupListSig.set(this._cohortListSig().filter((cohort) => cohort.parentGroupId === group.id));
  }

  preloadDependentLists(): void {
    const currentUser = this._authService.userSignal();

    if (!currentUser) {
      return;
    }

    if (currentUser.programId) {
      const program = this._programListSig().find((item) => item.id === currentUser.programId);
      if (program) {
        this.foundProgramListSig.set(this._programListSig().filter((item) => item.facultyId === program.facultyId));
      }
    }

    if (currentUser.programYearId) {
      const year = this._programYearListSig().find((item) => item.id === currentUser.programYearId);
      if (year) {
        this.foundYearListSig.set(this._programYearListSig().filter((item) => item.programId === year.programId));
      }
    }

    if (currentUser.groupCohortId) {
      const group = this._cohortListSig().find((item) => item.id === currentUser.groupCohortId);
      if (group) {
        this.foundGroupListSig.set(
          this._cohortListSig().filter((item) => item.programYearId === group.programYearId && !item.parentGroupId)
        );
      }
    }

    if (currentUser.semigroupCohortId) {
      const semigroup = this._cohortListSig().find((item) => item.id === currentUser.semigroupCohortId);
      if (semigroup?.parentGroupId) {
        this.foundSemigroupListSig.set(
          this._cohortListSig().filter((item) => item.parentGroupId === semigroup.parentGroupId)
        );
      }
    }
  }

  submit(input: UpdateMyProfileCmd, onSuccess: () => void): void {
    this._api
      .updateMyProfile$(input)
      .pipe(
        switchMap(() => this._authService.loadMe()),
        take(1)
      )
      .subscribe({
        next: () => {
          onSuccess();
        },
      });
  }
}
