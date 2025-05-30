import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminRoomService } from '@free-spot-service/room';
import { BookedEvent, FreeSpotUser, SemiGroup, SubjectItem, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { debounceTime } from 'rxjs';
import { Event, WeekDay } from '@free-spot/enums';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BookingService } from '@free-spot-service/booking';
import { UserService } from '@free-spot-service/user';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormErrorMessage } from '@free-spot/util';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';

@Component({
  selector: 'free-spot-admin-semigroup-timetable',

  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
],
  templateUrl: './admin-semigroup-timetable.component.html',
  styleUrl: './admin-semigroup-timetable.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSemisemiGroupTimetableComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _userService: UserService = inject(UserService);
  private _bookingService: BookingService = inject(BookingService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);

  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;
  semiGroupSig = model.required<SemiGroup>();
  subjectListSig = input.required<SubjectItem[]>();
  foundActivitiesSig: WritableSignal<TimetableActivityItem[]> = signal([]);

  startHourList: number[] = [8, 10, 12, 14, 16, 18];
  eventList: Event[] = Object.values(Event).filter((event: Event) => event !== Event.SPECIAL_EVENT);
  weekDayList: WeekDay[] = Object.values(WeekDay);
  addTimetableActivityFormSemiGroup!: FormGroup;
  addingTimetableActivity = false;

  emptyTimetableSig: Signal<boolean> = computed(() => {
    return !this.semiGroupSig()
      ?.timetable.map((timetableItem: TimeTableItem) =>
        timetableItem.activities ? timetableItem.activities.length !== 0 : !!timetableItem.activities,
      )
      .some((timetableItem: boolean) => timetableItem === true);
  });

  ngOnInit(): void {
    this._bookingService.init();
    this._userService.init();
    this.addTimetableActivityFormSemiGroup = this._formBuilder.nonNullable.group({
      weekDay: [WeekDay.MONDAY, [Validators.required, Validators.minLength(1)]],
      subject: [this.subjectListSig()[0], [Validators.required, Validators.minLength(1)]],
      timetableActivity: [{}, [Validators.required, Validators.minLength(1)]],
    });
    this.addTimetableActivityFormSemiGroup.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      let foundTimetableActivities: TimetableActivityItem[] = this._adminRoomService.getTimetableActivitiesByWeekDayAndSubject(
        this.addTimetableActivityFormSemiGroup.controls['weekDay'].value,
        this.addTimetableActivityFormSemiGroup.controls['subject'].value,
      );
      const currentActivities: TimetableActivityItem[] = this._getActivitiesFromItemByWeekDay(
        this.addTimetableActivityFormSemiGroup.controls['weekDay'].value,
      );
      foundTimetableActivities = foundTimetableActivities.filter((timetableActivity: TimetableActivityItem) => {
        return !currentActivities.some((exitentActivity: TimetableActivityItem) =>
          this._checkTimetebleActivityEquality(exitentActivity, timetableActivity),
        );
      });

      this.foundActivitiesSig.set(foundTimetableActivities);
    });
  }
  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  dysplaySubject(subjectItem: SubjectItem): string {
    if (subjectItem !== undefined && subjectItem !== null && Object.keys(subjectItem).length) {
      return subjectItem.shortName;
    }
    return '';
  }

  dysplayTimetableActivity(timetableActivity: TimetableActivityItem): string {
    if (timetableActivity !== undefined && timetableActivity !== null && Object.keys(timetableActivity).length) {
      return (
        timetableActivity.startHour +
        ' ' +
        timetableActivity.activityType +
        ' ' +
        timetableActivity.roomName +
        ' ' +
        timetableActivity.weekParity
      );
    }
    return '';
  }

  getTimeInterval(startHour: number): string {
    switch (startHour) {
      case 8:
        return '08-10';
      case 10:
        return '10-12';
      case 12:
        return '12-14';
      case 14:
        return '14-16';
      case 16:
        return '16-18';
      case 18:
        return '18-20';
      default:
        return '';
    }
  }

  onAddTimetableActivity(): void {
    if (this.semiGroupSig !== undefined) {
      const newTimetableActivity: TimetableActivityItem =
        this.addTimetableActivityFormSemiGroup.controls['timetableActivity'].value;

      if (this.semiGroupSig().students && this.semiGroupSig().students?.length) {
        this.semiGroupSig().students?.forEach((student: FreeSpotUser) => {
          const newBookedItem: BookedEvent = this._bookingService.generateUserBookedItemByActivity(newTimetableActivity, true);

          newTimetableActivity.freeSpots = newTimetableActivity.freeSpots - 1;
          newTimetableActivity.busySpots = newTimetableActivity.busySpots + 1;
          const oldUser: FreeSpotUser =
            this.userListSig().find(
              (user: FreeSpotUser) => user.firstName === student.firstName && user.familyName === student.familyName,
            ) || ({} as FreeSpotUser);
          const newUser: FreeSpotUser = {
            ...oldUser,
            bookingList: oldUser.bookingList ? [...oldUser.bookingList, newBookedItem] : [newBookedItem],
          };

          this._userService.updateFreeSpotUser(oldUser, newUser);
        });
      }

      const oldTimetableItem: TimeTableItem = this.semiGroupSig().timetable?.find(
        (timetableItem: TimeTableItem) =>
          timetableItem.weekDay === this.addTimetableActivityFormSemiGroup.controls['weekDay'].value,
      ) || { weekDay: this.addTimetableActivityFormSemiGroup.controls['weekDay'].value, activities: [], date: new Date() };

      const newTimetableItem: TimeTableItem = {
        ...oldTimetableItem,
        activities: oldTimetableItem.activities ? [...oldTimetableItem.activities, newTimetableActivity] : [newTimetableActivity],
      };
      const updatedSemiGroup: SemiGroup = {
        ...this.semiGroupSig(),
        timetable: this.semiGroupSig().timetable
          ? (this.semiGroupSig().timetable.map((timetableItem: TimeTableItem) =>
              timetableItem.weekDay === newTimetableItem.weekDay ? newTimetableItem : timetableItem,
            ) as TimeTableItem[])
          : [newTimetableItem],
      };
      this.semiGroupSig.set(updatedSemiGroup);
    }

    this.addTimetableActivityFormSemiGroup.reset();
    this.addingTimetableActivity = false;
  }

  onRemoveTimetableActivity(deletedTimetableActivity: TimetableActivityItem): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this activity?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          if (this.semiGroupSig().students && this.semiGroupSig().students?.length) {
            this.semiGroupSig().students?.forEach((student: FreeSpotUser) => {
              const newBookedItem: BookedEvent = this._bookingService.generateUserBookedItemByActivity(
                deletedTimetableActivity,
                false,
              );

              deletedTimetableActivity.freeSpots = deletedTimetableActivity.freeSpots + 1;
              deletedTimetableActivity.busySpots = deletedTimetableActivity.busySpots - 1;
              const oldUser: FreeSpotUser =
                this.userListSig().find(
                  (user: FreeSpotUser) => user.firstName === student.firstName && user.familyName === student.familyName,
                ) || ({} as FreeSpotUser);
              const newUser: FreeSpotUser = {
                ...oldUser,
                bookingList: oldUser.bookingList
                  ? oldUser.bookingList.filter(
                      (bookedEvent: BookedEvent) => !this._checkBookedEventEquality(bookedEvent, newBookedItem),
                    )
                  : [],
              };

              this._userService.updateFreeSpotUser(oldUser, newUser);
            });
          }

          const oldTimetableItem: TimeTableItem = this.semiGroupSig().timetable?.find(
            (timetableItem: TimeTableItem) => timetableItem.date === deletedTimetableActivity.date,
          ) as TimeTableItem;

          const newTimetableItem: TimeTableItem = {
            ...oldTimetableItem,
            activities: oldTimetableItem.activities?.filter(
              (timetableActivity: TimetableActivityItem) => timetableActivity !== deletedTimetableActivity,
            ),
          };

          const updatedSemiGroup: SemiGroup = {
            ...this.semiGroupSig(),
            timetable: this.semiGroupSig().timetable
              ? this.semiGroupSig().timetable.map((timetableItem: TimeTableItem) =>
                  timetableItem.weekDay === newTimetableItem.weekDay ? newTimetableItem : timetableItem,
                )
              : [newTimetableItem],
          };
          this.semiGroupSig.set(updatedSemiGroup);
        }
      });
  }

  private _checkTimetebleActivityEquality(
    timetableActivity1: TimetableActivityItem,
    timetableActivity2: TimetableActivityItem,
  ): boolean {
    return (
      timetableActivity1.roomName === timetableActivity2.roomName &&
      timetableActivity1.subjectItem.name === timetableActivity2.subjectItem.name &&
      timetableActivity1.startHour === timetableActivity2.startHour &&
      timetableActivity1.weekParity === timetableActivity2.weekParity &&
      new Date(timetableActivity1.date).getTime() === new Date(timetableActivity2.date).getTime()
    );
  }

  private _checkBookedEventEquality(bookedEvent1: BookedEvent, bookedEvent2: BookedEvent): boolean {
    return (
      bookedEvent1.roomName === bookedEvent2.roomName &&
      bookedEvent1.subjectItem.name === bookedEvent2.subjectItem.name &&
      bookedEvent1.startHour === bookedEvent2.startHour &&
      bookedEvent1.date === bookedEvent2.date &&
      bookedEvent1.activityType === bookedEvent2.activityType &&
      bookedEvent1.weekParity === bookedEvent2.weekParity
    );
  }

  private _getActivitiesFromItemByWeekDay(weekDay: WeekDay): TimetableActivityItem[] {
    let activities: TimetableActivityItem[] = [];
    this.semiGroupSig().timetable.forEach((timetableItem: TimeTableItem) => {
      timetableItem.weekDay === weekDay ? (timetableItem.activities ? (activities = timetableItem.activities) : '') : '';
    });

    return activities;
  }
}
