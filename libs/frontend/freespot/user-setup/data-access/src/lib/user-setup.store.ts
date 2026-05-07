import { computed, inject, Injectable, signal } from '@angular/core';
import { take } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '@free-spot/core';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { ProgramYearService } from '@free-spot-service/program-year';
import { ProgramService } from '@free-spot-service/program';
import { CohortService } from '@free-spot-service/cohort';
import { UserService } from '@free-spot-service/user';

import { Faculty } from '@free-spot-domain/faculty';
import { Program } from '@free-spot-domain/program';
import { ProgramYear } from '@free-spot-domain/program-year';
import { Cohort } from '@free-spot-domain/cohort';
import { UpdateMyProfileCmd } from '@free-spot-domain/user';

@Injectable({ providedIn: 'root' })
export class UserSetupStore {
  private readonly authService = inject(AuthService);
  private readonly facultyService = inject(AdminFacultyService);
  private readonly programYearService = inject(ProgramYearService);
  private readonly programService = inject(ProgramService);
  private readonly cohortService = inject(CohortService);
  private readonly userService = inject(UserService);

  readonly facultyListSig = this.facultyService.facultyListSig;
  readonly foundProgramListSig = signal<Program[]>([]);
  readonly foundYearListSig = signal<ProgramYear[]>([]);
  readonly foundGroupListSig = signal<Cohort[]>([]);
  readonly foundSemigroupListSig = signal<Cohort[]>([]);
  readonly loadingSig = signal(false);

  readonly shouldOpenDialogSig = computed(() => {
    const initialized = this.authService.initializedSignal$();
    const user = this.authService.userSignal$();

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
    this.facultyService.init();
    this.programService.init();
    this.programYearService.init();
    this.cohortService.init();
  }

  getCurrentUser() {
    return this.authService.userSignal$();
  }

  onFacultySelected(faculty: Faculty): void {
    this.foundProgramListSig.set(
      this.programService.selectProgramsByFacultyId(faculty.id)() || []
    );
    this.foundYearListSig.set([]);
    this.foundGroupListSig.set([]);
    this.foundSemigroupListSig.set([]);
  }

  onProgramSelected(program: Program): void {
    this.foundYearListSig.set(
      this.programYearService.selectYearByProgramId(program.id)() || []
    );
    this.foundGroupListSig.set([]);
    this.foundSemigroupListSig.set([]);
  }

  onProgramYearSelected(programYear: ProgramYear): void {
    this.foundGroupListSig.set(
      this.cohortService.selectGroupsByProgramYearId(programYear.id)() || []
    );
    this.foundSemigroupListSig.set([]);
  }

  onGroupSelected(group: Cohort): void {
    this.foundSemigroupListSig.set(
      this.cohortService.selectSemigroupByparentGroupId(group.id)() || []
    );
  }

  preloadDependentLists(): void {
    const currentUser = this.authService.userSignal$();

    if (!currentUser) {
      return;
    }

    if (currentUser.programId) {
      const program = this.programService.getSignalById(currentUser.programId)();
      if (program?.id) {
        this.foundProgramListSig.set(
          this.programService.selectProgramsByFacultyId(program.facultyId)() || []
        );
      }
    }

    if (currentUser.programYearId) {
      const year = this.programYearService.getSignalById(currentUser.programYearId)();
      if (year?.id) {
        this.foundYearListSig.set(
          this.programYearService.selectYearByProgramId(year.programId)() || []
        );
      }
    }

    if (currentUser.groupCohortId) {
      const group = this.cohortService.getSignalById(currentUser.groupCohortId)();
      if (group?.id) {
        this.foundGroupListSig.set(
          this.cohortService.selectGroupsByProgramYearId(group.programYearId)() || []
        );
      }
    }

    if (currentUser.semigroupCohortId) {
      const semigroup = this.cohortService.getSignalById(currentUser.semigroupCohortId)();
      if (semigroup?.id) {
        this.foundSemigroupListSig.set(
          this.cohortService.selectSemigroupByparentGroupId(semigroup.parentGroupId ?? '')() || []
        );
      }
    }
  }

  submit(input: UpdateMyProfileCmd, onSuccess: () => void): void {
    this.loadingSig.set(true);

    this.userService
      .updateMyProfile$(input)
      .pipe(
        switchMap(() => this.authService.loadMe()),
        take(1)
      )
      .subscribe({
        next: () => {
          this.loadingSig.set(false);
          onSuccess();
        },
        error: () => {
          this.loadingSig.set(false);
        },
      });
  }
}
