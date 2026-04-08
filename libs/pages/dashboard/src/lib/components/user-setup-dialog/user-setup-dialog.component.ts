import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { filter, Subscription, switchMap, take } from 'rxjs';

import { AdminFacultyService } from '@free-spot-service/faculty';
import { ProgramYearService } from '@free-spot-service/program-year';
import { ProgramService } from '@free-spot-service/program';
import { CohortService } from '@free-spot-service/cohort';
import { AuthService } from '@free-spot-service/auth';
import { FormErrorMessage } from '@free-spot/util';
import { Faculty } from '@free-spot-domain/faculty';
import { ProgramYear } from '@free-spot-domain/program-year';
import { Program } from '@free-spot-domain/program';
import { Cohort } from '@free-spot-domain/cohort';
import { UpdateMyProfileCmd } from '@free-spot-domain/user';
import { UserService } from '@free-spot-service/user';

@Component({
  selector: 'free-spot-user-setup-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './user-setup-dialog.component.html',
  styleUrl: './user-setup-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSetupDialogComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _dialogRef = inject(MatDialogRef<UserSetupDialogComponent>);
  private _adminFacultyService = inject(AdminFacultyService);
  private _adminProgramYearService = inject(ProgramYearService);
  private _adminProgramService = inject(ProgramService);
  private _adminCohortService = inject(CohortService);
  private _userService = inject(UserService);
  private _authService = inject(AuthService);
  private _formErrorMessage = inject(FormErrorMessage);

  readonly facultyListSig: Signal<Faculty[]> = this._adminFacultyService.facultyListSig;
  readonly foundProgramListSig: WritableSignal<Program[]> = signal([]);
  readonly foundYearListSig: WritableSignal<ProgramYear[]> = signal([]);
  readonly foundGroupListSig: WritableSignal<Cohort[]> = signal([]);
  readonly foundSemigroupListSig: WritableSignal<Cohort[]> = signal([]);
  readonly loadingSig = signal(false);

  readonly setupForm = this._formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    familyName: ['', [Validators.required, Validators.minLength(2)]],
    faculty: [null as Faculty | null, [Validators.required]],
    program: [null as Program | null, [Validators.required]],
    programYear: [null as ProgramYear | null, [Validators.required]],
    group: [null as Cohort | null, [Validators.required]],
    semigroup: [null as Cohort | null],
  });

  private readonly _subscriptionList: Subscription[] = [];

  ngOnInit(): void {
    this._adminFacultyService.init();
    this._adminProgramService.init();
    this._adminProgramYearService.init();
    this._adminCohortService.init();

    const currentUser = this._authService.userSignal$();

    this._subscriptionList.push(
      this.setupForm.controls.faculty.valueChanges
        .pipe(filter((faculty): faculty is Faculty => !!faculty))
        .subscribe((faculty: Faculty) => {
          this.foundProgramListSig.set(
            this._adminProgramService.selectProgramsByFacultyId(faculty.id)() || []
          );

          this.foundYearListSig.set([]);
          this.foundGroupListSig.set([]);
          this.foundSemigroupListSig.set([]);

          this.setupForm.controls.program.reset();
          this.setupForm.controls.programYear.reset();
          this.setupForm.controls.group.reset();
          this.setupForm.controls.semigroup.reset(null);
        }),
    );

    this._subscriptionList.push(
      this.setupForm.controls.program.valueChanges
        .pipe(filter((program): program is Program => !!program))
        .subscribe((program: Program) => {
          this.foundYearListSig.set(
            this._adminProgramYearService.selectYearByProgramId(program.id)() || []
          );

          this.foundGroupListSig.set([]);
          this.foundSemigroupListSig.set([]);

          this.setupForm.controls.programYear.reset();
          this.setupForm.controls.group.reset();
          this.setupForm.controls.semigroup.reset(null);
        }),
    );

    this._subscriptionList.push(
      this.setupForm.controls.programYear.valueChanges
        .pipe(filter((year): year is ProgramYear => !!year))
        .subscribe((year: ProgramYear) => {
          this.foundGroupListSig.set(
            this._adminCohortService.selectGroupsByProgramYearId(year.id)() || []
          );

          this.foundSemigroupListSig.set([]);

          this.setupForm.controls.group.reset();
          this.setupForm.controls.semigroup.reset(null);
        }),
    );

    this._subscriptionList.push(
      this.setupForm.controls.group.valueChanges
        .pipe(filter((group): group is Cohort => !!group))
        .subscribe((group: Cohort) => {
          this.foundSemigroupListSig.set(
            this._adminCohortService.selectSemigroupByparentGroupId(group.id)() || []
          );

          this.setupForm.controls.semigroup.reset(null);
        }),
    );

    if (currentUser) {
      this.setupForm.controls.firstName.setValue(currentUser.firstName ?? '');
      this.setupForm.controls.familyName.setValue(currentUser.familyName ?? '');

      if (currentUser.facultyId) {
        const faculty = this.facultyListSig().find((item: Faculty) => item.id === currentUser.facultyId) ?? null;
        if (faculty) {
          this.setupForm.controls.faculty.setValue(faculty);
        }
      }

      if (currentUser.programId) {
        const program = this._adminProgramService.getSignalById(currentUser.programId)();
        if (program?.id) {
          this.foundProgramListSig.set(
            this._adminProgramService.selectProgramsByFacultyId(program.facultyId)() || []
          );
          this.setupForm.controls.program.setValue(program);
        }
      }

      if (currentUser.programYearId) {
        const year = this._adminProgramYearService.getSignalById(currentUser.programYearId)();
        if (year?.id) {
          this.foundYearListSig.set(
            this._adminProgramYearService.selectYearByProgramId(year.programId)() || []
          );
          this.setupForm.controls.programYear.setValue(year);
        }
      }

      if (currentUser.groupCohortId) {
        const group = this._adminCohortService.getSignalById(currentUser.groupCohortId)();
        if (group?.id) {
          this.foundGroupListSig.set(
            this._adminCohortService.selectGroupsByProgramYearId(group.programYearId)() || []
          );
          this.setupForm.controls.group.setValue(group);
        }
      }

      if (currentUser.semigroupCohortId) {
        const semigroup = this._adminCohortService.getSignalById(currentUser.semigroupCohortId)();
        if (semigroup?.id) {
          this.foundSemigroupListSig.set(
            this._adminCohortService.selectSemigroupByparentGroupId(semigroup.parentGroupId ?? '')() || []
          );
          this.setupForm.controls.semigroup.setValue(semigroup);
        }
      }
    }
  }

  displayError = (control: AbstractControl | null) =>
    this._formErrorMessage.displayFormErrorMessage(control);

  ngOnDestroy(): void {
    this._subscriptionList.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  onSubmitSetupForm(): void {
    if (this.setupForm.invalid) {
      this.setupForm.markAllAsTouched();
      return;
    }

    const firstName = this.setupForm.controls.firstName.value;
    const familyName = this.setupForm.controls.familyName.value;
    const faculty = this.setupForm.controls.faculty.value;
    const program = this.setupForm.controls.program.value;
    const programYear = this.setupForm.controls.programYear.value;
    const group = this.setupForm.controls.group.value;
    const semigroup = this.setupForm.controls.semigroup.value;

    if (!firstName || !familyName || !faculty || !program || !programYear || !group) {
      return;
    }

    const input: UpdateMyProfileCmd = {
      firstName,
      familyName,
      facultyId: faculty.id,
      programId: program.id,
      programYearId: programYear.id,
      groupCohortId: group.id,
      semigroupCohortId: semigroup?.id ?? null,
    };

    this.loadingSig.set(true);

    this._userService
      .updateMyProfile$(input)
      .pipe(
        switchMap(() => this._authService.loadMe()),
        take(1)
      )
      .subscribe({
        next: () => {
          this.loadingSig.set(false);
          this._dialogRef.close(true);
        },
        error: (err: unknown) => {
          console.error(err);
          this.loadingSig.set(false);
        },
      });

  }
}
