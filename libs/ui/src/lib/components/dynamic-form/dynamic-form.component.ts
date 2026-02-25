import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Event, WeekParity } from '@free-spot/enums';
import { BookingItemComponent } from '../booking-item/booking-item.component';
import {
  BookedEvent,
  BuildingLegacy,
  FreeSpotDate,
  FreeSpotUser,
  RoomLegacy,
  SubjectItemLegacy,
  TimetableActivityItemLegacy,
  TimeTableItemLecagy,
} from '@free-spot/models';
import { SUBJECT_LIST } from '@free-spot/constants';
import { UserService } from '@free-spot-service/user';
import { AdminRoomService } from '@free-spot-service/room';
import { AppDateService } from '@free-spot-service/app-date';
import { FormErrorMessage } from '@free-spot/util';
import { AdminEventService } from '@free-spot-service/event';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-dynamic-form',

  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    BookingItemComponent,
    TranslateModule
],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _destroyRef = inject(DestroyRef);
  private _userService: UserService = inject(UserService);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _appDateService: AppDateService = inject(AppDateService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _adminEventService: AdminEventService = inject(AdminEventService);
  destroyRef = inject(DestroyRef);

  appDateSig: Signal<FreeSpotDate> = this._appDateService.appDateSig;
  weekParitySig: Signal<WeekParity> = computed(() => {
    if (this.appDateSig().weekCount % 2 === 0) {
      return WeekParity.EVEN;
    } else {
      return WeekParity.ODD;
    }
  });

  private _currentUserEmail = (
    JSON.parse(localStorage.getItem('user') as string) as {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    }
  ).email;
  EVENT = Event;
  currentUserSig: Signal<FreeSpotUser> = this._userService.getFreeSpotUserByEmail(this._currentUserEmail);
  eventBookingSelectedSig = input<Event>(Event.LABORATORY);
  subjectItemListSig: InputSignal<SubjectItemLegacy[]> = input<SubjectItemLegacy[]>(SUBJECT_LIST);
  roomListSig = this._adminRoomService.roomListSigLegacy;

  eventListSigLegacy: Signal<Event[]> = input<Event[]>(Object.values(Event).filter((event: Event) => event !== Event.COURSE));
  searchForm!: FormGroup;
  searchActiveSig: WritableSignal<boolean> = signal(false);
  specialEventListSig: Signal<BuildingLegacy[]> = this._adminEventService.eventListSigLegacy;
  filteredSpecialEventListSig: Signal<BuildingLegacy[]> = computed(() =>
    this.specialEventListSig()
      .filter(
        (specialEvent: BuildingLegacy) =>
          !this.currentUserSig().eventList?.some(
            (bookedSpecialEvent: BookedEvent) => bookedSpecialEvent.name === specialEvent.name,
          ),
      )
      .filter((event: BuildingLegacy) => new Date().getTime() - new Date(event.date as Date).getTime() <= 0),
  );
  timetableActivityListFoundSig: WritableSignal<TimetableActivityItemLegacy[]> = signal([]);
  oldTimetableActivitySig: WritableSignal<TimetableActivityItemLegacy> = signal({} as TimetableActivityItemLegacy);

  ngOnInit(): void {
    this._userService.init();
    this._adminRoomService.init();
    this._appDateService.init();
    this._adminEventService.init();
    this.searchForm = this._formBuilder.group({
      eventBooking: [this.eventBookingSelectedSig(), Validators.required],
      subject: [this.subjectItemListSig()[0], Validators.required],
      event: [this.specialEventListSig()[0], Validators.required],
    });
    this.searchForm.controls['event'].disable();

    this.searchForm.controls['eventBooking'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: Event) => {
      if (event === this.EVENT.SPECIAL_EVENT) {
        this.searchForm.controls['event'].enable();
        this.searchForm.controls['subject'].disable();
      } else {
        this.searchForm.controls['event'].disable();
        this.searchForm.controls['subject'].enable();
      }
    });

    this.searchForm.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => this.searchActiveSig.set(false));
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  get event(): Event {
    return this.searchForm.get('eventBooking')?.value as Event;
  }

  onSubmit(): void {
    if (this.searchForm.controls['eventBooking'].value !== Event.SPECIAL_EVENT) {
      let timetableActivityListFound: TimetableActivityItemLegacy[] = [];
      const oldBookedEvent: BookedEvent =
        this.currentUserSig().bookingList.find(
          (bookedEvent: BookedEvent) =>
            bookedEvent.subjectItem.name === this.searchForm.controls['subject'].value.name &&
            bookedEvent.activityType === this.searchForm.controls['eventBooking'].value,
        ) || ({} as BookedEvent);

      if (Object.keys(oldBookedEvent).length) {
        this.roomListSig().forEach((room: RoomLegacy) => {
          if (
            room.subjectList?.some(
              (roomSubject: SubjectItemLegacy) => roomSubject.name === this.searchForm.controls['subject'].value.name,
            )
          ) {
            room.timetable.forEach((timetableItem: TimeTableItemLecagy) => {
              timetableItem.activities?.forEach((timetableActivity: TimetableActivityItemLegacy) => {
                if (
                  timetableActivity.subjectItem.name === this.searchForm.controls['subject'].value.name &&
                  timetableActivity.activityType === this.searchForm.controls['eventBooking'].value
                ) {
                  timetableActivityListFound.push(timetableActivity);
                }
              });
            });
          }
        });

        this.oldTimetableActivitySig.set(
          timetableActivityListFound.find(
            (timetableActivity: TimetableActivityItemLegacy) =>
              timetableActivity.startHour === oldBookedEvent.startHour &&
              timetableActivity.date === oldBookedEvent.date &&
              timetableActivity.weekParity === oldBookedEvent.weekParity,
          ) || ({} as TimetableActivityItemLegacy),
        );

        timetableActivityListFound = timetableActivityListFound.filter((timetableActivity: TimetableActivityItemLegacy) => {
          return timetableActivity.weekParity === WeekParity.BOTH || timetableActivity.weekParity === this.weekParitySig();
        });

        timetableActivityListFound = timetableActivityListFound.filter((timetableActivity: TimetableActivityItemLegacy) =>
          timetableActivity.startHour !== oldBookedEvent.startHour
            ? true
            : timetableActivity.date !== oldBookedEvent.date
              ? true
              : timetableActivity.weekParity !== oldBookedEvent.weekParity,
        );

        timetableActivityListFound = timetableActivityListFound.filter(
          (timetableActivity: TimetableActivityItemLegacy) =>
            new Date().setHours(0, 0, 0, 0) - new Date(timetableActivity.date).getTime() <= 0,
        );

        timetableActivityListFound = timetableActivityListFound.filter((timetableActivity: TimetableActivityItemLegacy) =>
          new Date().setHours(0, 0, 0, 0) - new Date(timetableActivity.date).getTime() === 0
            ? new Date().getHours() < timetableActivity.startHour
            : true,
        );

        timetableActivityListFound = timetableActivityListFound.filter(
          (timetableActivity: TimetableActivityItemLegacy) => timetableActivity.freeSpots > 0,
        );
      }

      this.timetableActivityListFoundSig.set(timetableActivityListFound);
      this.searchActiveSig.set(true);
    } else {
      const oldBookedSpecialEvent: BookedEvent =
        this.currentUserSig().eventList?.find(
          (bookedEvent: BookedEvent) => bookedEvent.name === this.searchForm.controls['event'].value.name,
        ) || ({} as BookedEvent);

      if (!Object.keys(oldBookedSpecialEvent).length) {
        const specialEvent: BuildingLegacy = this.searchForm.controls['event'].value;

        const timetableActivityListFound: TimetableActivityItemLegacy[] = [
          {
            startHour: specialEvent.startHour as number,
            endHour: (specialEvent.startHour as number) + 2,
            subjectItem: {} as SubjectItemLegacy,
            roomName: specialEvent.roomName as string,
            activityType: Event.SPECIAL_EVENT,
            weekParity: WeekParity.BOTH,
            freeSpots: specialEvent.freeSpots as number,
            busySpots: specialEvent.busySpots as number,
            date: specialEvent.date as Date,
            name: specialEvent.name,
          },
        ];

        this.timetableActivityListFoundSig.set(timetableActivityListFound);
        this.searchActiveSig.set(true);
      }
    }
  }
}
