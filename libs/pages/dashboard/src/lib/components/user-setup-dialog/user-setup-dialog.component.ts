import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, Signal, WritableSignal } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { filter, Subscription } from 'rxjs';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { FacultyLegacy, FreeSpotUser, Group, SemiGroup, Year } from '@free-spot/models';
import { UserService } from '@free-spot-service/user';
import { Language, Theme } from '@free-spot/enums';

import { BookingService } from '@free-spot-service/booking';
import { FormErrorMessage } from '@free-spot/util';

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
  private _bookingService: BookingService = inject(BookingService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);

  protected user: FreeSpotUser = inject(MAT_DIALOG_DATA);

  facultyListSig: Signal<FacultyLegacy[]> = this._adminFacultyService.facultyListSig;
  foundYearListSig: WritableSignal<Year[]> = signal([]);
  foundGroupListSig: WritableSignal<Group[]> = signal([]);
  foundSemigroupListSig: WritableSignal<SemiGroup[]> = signal([]);

  setupForm = this._formBuilder.group({
    faculty: [this.facultyListSig()[0] || null, [Validators.required, Validators.minLength(1)]],
    currentYear: [{} as Year, [Validators.required, Validators.minLength(1)]],
    group: [{} as Group, [Validators.required, Validators.minLength(1)]],
    semigroup: {} as SemiGroup,
  });
  subscriptionList: Subscription[] = [];

  ngOnInit(): void {
    this._bookingService.init();
    this._adminFacultyService.init();
    this.subscriptionList.push(
      this.setupForm.controls['faculty'].valueChanges
        .pipe(filter((faculty) => !!faculty))
        .subscribe((faculty: FacultyLegacy | null) => {
          this.foundYearListSig.set(faculty?.yearList || []);
          this.setupForm.controls['currentYear'].reset();
          this.setupForm.controls['group'].reset();
          this.setupForm.controls['semigroup'].reset();
        }),
    );

    this.subscriptionList.push(
      this.setupForm.controls['currentYear'].valueChanges.pipe(filter((year) => !!year)).subscribe((year: Year | null) => {
        this.foundGroupListSig.set(year?.yearGroupList || []);
        this.setupForm.controls['group'].reset();
        this.setupForm.controls['semigroup'].reset();
      }),
    );

    this.subscriptionList.push(
      this.setupForm.controls['group'].valueChanges.pipe(filter((group) => !!group)).subscribe((group: Group | null) => {
        this.foundSemigroupListSig.set(group?.semigroups || []);
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
      currentYear: this.setupForm.controls['currentYear'].value?.name || '',
      group: this.setupForm.controls['group'].value?.name || '',
      semiGroup: this.setupForm.controls['semigroup'].value?.name || '',
      preferdLanguage: Language.EN,
      preferedTheme: Theme.DARK,
      bookingList: this._bookingService.generateUserBookedItems(
        this.setupForm.controls['group'].value as Group,
        true,
        this.setupForm.controls['semigroup'].value as SemiGroup,
      ),
    };

    const newFacultyWithUpdatedSpots = this._adminFacultyService.getFacultyByName(
      this.setupForm.controls['faculty'].value?.name as string,
    )();

    const updatedFaculty: FacultyLegacy = {
      ...newFacultyWithUpdatedSpots,
      yearList: newFacultyWithUpdatedSpots.yearList?.map((year: Year) => {
        if (year.name === this.setupForm.controls['currentYear'].value?.name) {
          return {
            ...year,
            yearGroupList: year.yearGroupList.map((group: Group) => {
              if (group.name === this.setupForm.controls['group'].value?.name) {
                return {
                  ...group,
                  studentList: group.studentList ? [...group.studentList, updatedUser] : [updatedUser],
                  semigroups: this.setupForm.controls['semigroup'].value?.name
                    ? group.semigroups?.map((semiGroup: SemiGroup) => {
                        if (semiGroup.name === this.setupForm.controls['semigroup'].value?.name) {
                          return {
                            ...semiGroup,
                            students: semiGroup.students ? [...semiGroup.students, updatedUser] : [updatedUser],
                          };
                        } else {
                          return semiGroup;
                        }
                      })
                    : [],
                };
              } else {
                return group;
              }
            }),
          };
        } else {
          return year;
        }
      }),
    } as FacultyLegacy;

    this._adminFacultyService.updateFaculty(this._adminFacultyService.getFacultyByName(updatedFaculty.name)(), updatedFaculty);
    this._userService.updateFreeSpotUser(this.user, updatedUser);
    this._dialogRef.close();
  }
}
