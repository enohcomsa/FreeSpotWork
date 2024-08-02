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
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

@Component({
  selector: 'free-spot-admin-semigroup-timetable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
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
      weekDay: [WeekDay.MONDAY],
      subject: [this.subjectListSig()[0]],
      timetableActivity: [{}],
    });
    this.addTimetableActivityFormSemiGroup.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.foundActivitiesSig.set(
        this._adminRoomService.getTimetableActivitiesByWeekDayAndSubject(
          this.addTimetableActivityFormSemiGroup.controls['weekDay'].value,
          this.addTimetableActivityFormSemiGroup.controls['subject'].value,
        ),
      );
    });
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
    if (this.semiGroupSig().students && this.semiGroupSig().students?.length) {
      this.semiGroupSig().students?.forEach((student: FreeSpotUser) => {
        const newBookedItem: BookedEvent = this._bookingService.generateUserBookedItemByActivity(deletedTimetableActivity, false);

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

  private _checkTimetebleActivityEquality(
    timetableActivity1: TimetableActivityItem,
    timetableActivity2: TimetableActivityItem,
  ): boolean {
    return (
      timetableActivity1.roomName === timetableActivity2.roomName &&
      timetableActivity1.subjectItem.name === timetableActivity2.subjectItem.name &&
      timetableActivity1.startHour === timetableActivity2.startHour &&
      timetableActivity1.weekParity === timetableActivity2.weekParity &&
      timetableActivity1.date === timetableActivity2.date
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
}
