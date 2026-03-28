import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, Signal, WritableSignal } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { filter, Subscription } from 'rxjs';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { FreeSpotUser } from '@free-spot/models';
import { UserService } from '@free-spot-service/user';
import { Language, Theme } from '@free-spot/enums';
import { ProgramYear } from '@free-spot-domain/program-year';
import { Cohort } from '@free-spot-domain/cohort';
import { BookingService } from '@free-spot-service/booking';
import { FormErrorMessage } from '@free-spot/util';
import { Faculty } from '@free-spot-domain/faculty';
import { ProgramYearService } from '@free-spot-service/program-year';
import { ProgramService } from '@free-spot-service/program';
import { Program } from '@free-spot-domain/program';
import { CohortService } from '@free-spot-service/cohort';


@Component({
  selector: 'free-spot-user-setup-dialog',

  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './user-setup-dialog.component.html',
  styleUrl: './user-setup-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSetupDialogComponent implements OnInit, OnDestroy {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _dialogRef: MatDialogRef<UserSetupDialogComponent> = inject(MatDialogRef<UserSetupDialogComponent>);
  private _userService: UserService = inject(UserService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _adminProgramYearService: ProgramYearService = inject(ProgramYearService);
  private _adminCohortService: CohortService = inject(CohortService);

  private _adminProgramService: ProgramService = inject(ProgramService);
  private _bookingService: BookingService = inject(BookingService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);

  protected user: FreeSpotUser = inject(MAT_DIALOG_DATA);

  facultyListSig: Signal<Faculty[]> = this._adminFacultyService.facultyListSig;
  foundYearListSig: WritableSignal<ProgramYear[]> = signal([]);
  foundGroupListSig: WritableSignal<Cohort[]> = signal([]);
  foundSemigroupListSig: WritableSignal<Cohort[]> = signal([]);

  setupForm = this._formBuilder.group({
    faculty: [this.facultyListSig()[0] || null, [Validators.required, Validators.minLength(1)]],
    currentYear: [{} as ProgramYear, [Validators.required, Validators.minLength(1)]],
    group: [{} as Cohort, [Validators.required, Validators.minLength(1)]],
    semigroup: {} as Cohort,
  });
  subscriptionList: Subscription[] = [];

  ngOnInit(): void {
    this._bookingService.init();
    this._adminFacultyService.init();
    this._adminProgramYearService.init();
    this._adminCohortService.init();
    this._adminProgramService.init();


    this.subscriptionList.push(
      this.setupForm.controls['faculty'].valueChanges
        .pipe(filter((faculty) => !!faculty))
        .subscribe((faculty: Faculty | null) => {
          if (!faculty) {
            return;
          }

          const programList: Program[] = this._adminProgramService.selectProgramsByFacultyId(faculty?.id)();
          this.foundYearListSig.set(this._adminProgramYearService.selectYearByProgramId(programList[0].id)() || []);
          this.setupForm.controls['currentYear'].reset();
          this.setupForm.controls['group'].reset();
          this.setupForm.controls['semigroup'].reset();
        }),
    );

    this.subscriptionList.push(
      this.setupForm.controls['currentYear'].valueChanges.pipe(filter((year) => !!year)).subscribe((year: ProgramYear) => {
        this.foundGroupListSig.set(this._adminCohortService.selectGroupsByProgramYearId(year.id)() || []);
        this.setupForm.controls['group'].reset();
        this.setupForm.controls['semigroup'].reset();
      }),
    );

    this.subscriptionList.push(
      this.setupForm.controls['group'].valueChanges.pipe(filter((group) => !!group)).subscribe((group: Cohort) => {
        this.foundSemigroupListSig.set(this._adminCohortService.selectSemigroupByparentGroupId(group.id)() || []);
        this.setupForm.controls['semigroup'].reset();
      }),
    );
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  ngOnDestroy(): void {
    this.subscriptionList.forEach((subsciption: Subscription) => subsciption.unsubscribe());
  }

  onSubmitSetupForm(): void {
    const updatedUser: FreeSpotUser = {
      ...this.user,
      faculty: this.setupForm.controls['faculty'].value?.name || '',
      currentYear: this.setupForm.controls['currentYear'].value?.label || '',
      group: this.setupForm.controls['group'].value?.name || '',
      semiGroup: this.setupForm.controls['semigroup'].value?.name || '',
      preferdLanguage: Language.EN,
      preferedTheme: Theme.DARK,
      // bookingList: this._bookingService.generateUserBookedItems(
      //   this.setupForm.controls['group'].value as GroupLegacy,
      //   true,
      //   this.setupForm.controls['semigroup'].value as SemiGroup,
      // ),
    };

    // const newFacultyWithUpdatedSpots = this._adminFacultyService.getFacultyByName(
    //   this.setupForm.controls['faculty'].value?.name as string,
    // )();

    // const updatedFaculty: FacultyLegacy = {
    //   ...newFacultyWithUpdatedSpots,
    //   yearList: newFacultyWithUpdatedSpots.yearList?.map((year: Year) => {
    //     if (year.name === this.setupForm.controls['currentYear'].value?.name) {
    //       return {
    //         ...year,
    //         yearGroupList: year.yearGroupList.map((group: GroupLegacy) => {
    //           if (group.name === this.setupForm.controls['group'].value?.name) {
    //             return {
    //               ...group,
    //               studentList: group.studentList ? [...group.studentList, updatedUser] : [updatedUser],
    //               semigroups: this.setupForm.controls['semigroup'].value?.name
    //                 ? group.semigroups?.map((semiGroup: SemiGroup) => {
    //                   if (semiGroup.name === this.setupForm.controls['semigroup'].value?.name) {
    //                     return {
    //                       ...semiGroup,
    //                       students: semiGroup.students ? [...semiGroup.students, updatedUser] : [updatedUser],
    //                     };
    //                   } else {
    //                     return semiGroup;
    //                   }
    //                 })
    //                 : [],
    //             };
    //           } else {
    //             return group;
    //           }
    //         }),
    //       };
    //     } else {
    //       return year;
    //     }
    //   }),
    // } as FacultyLegacy;

    // this._adminFacultyService.updateFaculty(this._adminFacultyService.getFacultyByName(updatedFaculty.name)(), updatedFaculty);
    this._userService.updateFreeSpotUser(this.user, updatedUser);
    this._dialogRef.close();
  }
}
