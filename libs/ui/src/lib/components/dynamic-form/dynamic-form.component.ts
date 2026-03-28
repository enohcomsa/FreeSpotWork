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
import { ActivityType, WeekDay, WeekParity } from '@free-spot/enums';
import { BookingItemComponent } from '../booking-item/booking-item.component';
import { BookedEvent, FreeSpotDate, } from '@free-spot/models';

import { UserService } from '@free-spot-service/user';
import { AdminRoomService } from '@free-spot-service/room';
import { AppDateService } from '@free-spot-service/app-date';
import { FormErrorMessage } from '@free-spot/util';
import { AdminEventService } from '@free-spot-service/event';
import { TranslateModule } from '@ngx-translate/core';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';

import { SubjectService } from '@free-spot-service/subject';
import { SubjectItem } from '@free-spot-domain/subject';
import { SpecialEvent } from '@free-spot-domain/event';
import { TimetableActivity } from '@free-spot-domain/timetable-activity';


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
  // private _userService: UserService = inject(UserService);TODO replace with new userservice
  private _appDateService: AppDateService = inject(AppDateService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _adminEventService: AdminEventService = inject(AdminEventService);
  private _subjectService: SubjectService = inject(SubjectService);
  private _adminTimetableActivityService: AdminTimetableActivityService = inject(AdminTimetableActivityService);


  destroyRef = inject(DestroyRef);

  appDateSig: Signal<FreeSpotDate> = this._appDateService.appDateSig;

  weekParitySig: Signal<WeekParity> = computed(() => {
    if (this.appDateSig().weekCount % 2 === 0) {
      return WeekParity.EVEN;
    } else {
      return WeekParity.ODD;
    }
  });

  // private _currentUserEmail = (
  //   JSON.parse(localStorage.getItem('user') as string) as {
  //     email: string;
  //     id: string;
  //     _token: string;
  //     _tokenExpirationDate: Date;
  //   }
  // ).email;
  ACTIVITY_TYPE = ActivityType;
  // currentUserSig: Signal<FreeSpotUser> = this._userService.getFreeSpotUserByEmail(this._currentUserEmail);
  activityTypeListSig: Signal<ActivityType[]> = input<ActivityType[]>(Object.values(ActivityType).filter((event: ActivityType) => event !== ActivityType.COURSE));

  activityTypeSelectedSig = input<ActivityType>(ActivityType.LABORATORY);
  subjectItemListSig: InputSignal<SubjectItem[]> = input<SubjectItem[]>(this._subjectService.subjectListSig());
  specialEventListSig: Signal<SpecialEvent[]> = this._adminEventService.eventListSig;


  searchForm!: FormGroup;
  searchActiveSig: WritableSignal<boolean> = signal(false);

  filteredSpecialEventListSig: Signal<SpecialEvent[]> = this._adminEventService.eventListSig;//TODO filter user already booked events and past events

  timetableActivityListFoundSig: WritableSignal<TimetableActivity[]> = signal([]);
  oldTimetableActivitySig: WritableSignal<TimetableActivity> = signal({} as TimetableActivity);

  ngOnInit(): void {
    this._adminTimetableActivityService.init();
    this._subjectService.init();
    this._appDateService.init();
    this._adminEventService.init();

    this.searchForm = this._formBuilder.group({
      eventBooking: [this.activityTypeSelectedSig(), Validators.required],
      subject: [this.subjectItemListSig()[0], Validators.required],
      event: [this.specialEventListSig()[0], Validators.required],
    });
    this.searchForm.controls['event'].disable();

    this.searchForm.controls['eventBooking'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((activityType: ActivityType) => {
      if (activityType === ActivityType.SPECIAL_EVENT) {
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

  get event(): ActivityType {
    return this.searchForm.get('eventBooking')?.value as ActivityType;
  }

  onSubmit(): void {
    if (this.searchForm.controls['eventBooking'].value !== ActivityType.SPECIAL_EVENT) {
      const timetableActivityListFound: TimetableActivity[] = [];
      const oldBookedEvent: BookedEvent = {} as BookedEvent;//TODO: update booking
      // this.currentUserSig().bookingList.find(
      //   (bookedEvent: BookedEvent) =>
      //     bookedEvent.subjectItem.name === this.searchForm.controls['subject'].value.name &&
      //     bookedEvent.activityType === this.searchForm.controls['eventBooking'].value,
      // ) || ({} as BookedEvent);

      if (Object.keys(oldBookedEvent).length) {
        //get future timetable activities that match the selected filter or empty array


      }

      this.timetableActivityListFoundSig.set(timetableActivityListFound);
      this.searchActiveSig.set(true);

    } else {
      const oldBookedSpecialEvent: BookedEvent = {} as BookedEvent;//TODO: update booking

      // const oldBookedSpecialEvent: BookedEvent =
      //   this.currentUserSig().eventList?.find(
      //     (bookedEvent: BookedEvent) => bookedEvent.name === this.searchForm.controls['event'].value.name,
      //   ) || ({} as BookedEvent);

      if (!Object.keys(oldBookedSpecialEvent).length) {
        const specialEvent: SpecialEvent = this.searchForm.controls['event'].value;

        const timetableActivityListFound: TimetableActivity[] = [
          {
            startHour: specialEvent.startHour as number,//TODO update with the correct data
            endHour: (specialEvent.startHour as number) + 2,
            subjectId: '',
            roomId: specialEvent.roomId,
            weekDay: WeekDay.MONDAY,
            cohortIds: [],
            id: '',
            activityType: ActivityType.SPECIAL_EVENT,
            weekParity: WeekParity.BOTH,
            capacity: 10,
            freeSpots: specialEvent.reservedSpots as number,
            busySpots: specialEvent.reservedSpots as number,
            reservedSpots: specialEvent.reservedSpots as number,
            date: specialEvent.date as string,
            // name: specialEvent.name,
          },
        ];

        this.timetableActivityListFoundSig.set(timetableActivityListFound);
        this.searchActiveSig.set(true);
      }
    }
  }
}
