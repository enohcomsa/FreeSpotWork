import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { filter, Subscription } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';
import { FormErrorMessage } from '@free-spot/util';

import { Faculty } from '@free-spot-domain/faculty';
import { ProgramYear } from '@free-spot-domain/program-year';
import { Program } from '@free-spot-domain/program';
import { Cohort } from '@free-spot-domain/cohort';
import { UpdateMyProfileCmd } from '@free-spot-domain/user';

import { UserSetupStore } from '@free-spot/user-setup/data-access';

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
    TranslateModule,
  ],
  templateUrl: './user-setup-dialog.component.html',
  styleUrl: './user-setup-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSetupDialogComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserSetupDialogComponent>);
  private readonly store = inject(UserSetupStore);
  private readonly formErrorMessage = inject(FormErrorMessage);

  readonly facultyListSig = this.store.facultyListSig;
  readonly foundProgramListSig = this.store.foundProgramListSig;
  readonly foundYearListSig = this.store.foundYearListSig;
  readonly foundGroupListSig = this.store.foundGroupListSig;
  readonly foundSemigroupListSig = this.store.foundSemigroupListSig;
  readonly loadingSig = this.store.loadingSig;

  readonly setupForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    familyName: ['', [Validators.required, Validators.minLength(2)]],
    faculty: [null as Faculty | null, [Validators.required]],
    program: [null as Program | null, [Validators.required]],
    programYear: [null as ProgramYear | null, [Validators.required]],
    group: [null as Cohort | null, [Validators.required]],
    semigroup: [null as Cohort | null],
  });

  private readonly subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.store.init();
    this.store.preloadDependentLists();

    const currentUser = this.store.getCurrentUser();

    this.subscriptions.push(
      this.setupForm.controls.faculty.valueChanges
        .pipe(filter((faculty): faculty is Faculty => !!faculty))
        .subscribe((faculty) => {
          this.store.onFacultySelected(faculty);
          this.setupForm.controls.program.reset();
          this.setupForm.controls.programYear.reset();
          this.setupForm.controls.group.reset();
          this.setupForm.controls.semigroup.reset(null);
        })
    );

    this.subscriptions.push(
      this.setupForm.controls.program.valueChanges
        .pipe(filter((program): program is Program => !!program))
        .subscribe((program) => {
          this.store.onProgramSelected(program);
          this.setupForm.controls.programYear.reset();
          this.setupForm.controls.group.reset();
          this.setupForm.controls.semigroup.reset(null);
        })
    );

    this.subscriptions.push(
      this.setupForm.controls.programYear.valueChanges
        .pipe(filter((year): year is ProgramYear => !!year))
        .subscribe((year) => {
          this.store.onProgramYearSelected(year);
          this.setupForm.controls.group.reset();
          this.setupForm.controls.semigroup.reset(null);
        })
    );

    this.subscriptions.push(
      this.setupForm.controls.group.valueChanges
        .pipe(filter((group): group is Cohort => !!group))
        .subscribe((group) => {
          this.store.onGroupSelected(group);
          this.setupForm.controls.semigroup.reset(null);
        })
    );

    if (currentUser) {
      this.setupForm.controls.firstName.setValue(currentUser.firstName ?? '');
      this.setupForm.controls.familyName.setValue(currentUser.familyName ?? '');

      if (currentUser.facultyId) {
        const faculty = this.facultyListSig().find((f) => f.id === currentUser.facultyId) ?? null;
        if (faculty) this.setupForm.controls.faculty.setValue(faculty);
      }
    }
  }

  displayError = (control: AbstractControl | null) =>
    this.formErrorMessage.displayFormErrorMessage(control);

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onSubmitSetupForm(): void {
    if (this.setupForm.invalid) {
      this.setupForm.markAllAsTouched();
      return;
    }

    const v = this.setupForm.value;

    if (!v.firstName || !v.familyName || !v.faculty || !v.program || !v.programYear || !v.group) {
      return;
    }

    const input: UpdateMyProfileCmd = {
      firstName: v.firstName,
      familyName: v.familyName,
      facultyId: v.faculty.id,
      programId: v.program.id,
      programYearId: v.programYear.id,
      groupCohortId: v.group.id,
      semigroupCohortId: v.semigroup?.id ?? null,
    };

    this.store.submit(input, () => this.dialogRef.close(true));
  }
}
