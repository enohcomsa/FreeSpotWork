import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Event } from '@free-spot/enums';
import { BookingItemComponent } from '../booking-item/booking-item.component';
import { BookedEvent, FreeSpotUser, Room, SubjectItem, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { SUBJECT_LIST } from '@free-spot/constants';
import { UserService } from '@free-spot-service/user';
import { AdminRoomService } from '@free-spot-service/room';

@Component({
  selector: 'free-spot-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    BookingItemComponent,
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
  subjectItemListSig: InputSignal<SubjectItem[]> = input<SubjectItem[]>(SUBJECT_LIST);
  roomListSig = this._adminRoomService.roomListSig;

  eventListSig: Signal<Event[]> = input<Event[]>(Object.values(Event).filter((event: Event) => event !== Event.COURSE));
  searchForm!: FormGroup;
  searchActive$: WritableSignal<boolean> = signal(false);
  eventNames: string[] = ['event_efeffe', 'event_deww', 'event_eeeee', 'event_ertty', 'event_xzxz'];
  timetableActivityListFoundSig: WritableSignal<TimetableActivityItem[]> = signal([]);

  ngOnInit(): void {
    this._userService.init();
    this._adminRoomService.init();
    this.searchForm = this._formBuilder.group({
      eventBooking: this.eventBookingSelectedSig(),
      subject: this.subjectItemListSig()[0],
      event: [this.eventNames[0]],
    });

    this.searchForm.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => this.searchActive$.set(false));
  }

  get event(): Event {
    return this.searchForm.get('eventBooking')?.value as Event;
  }

  onSubmit(): void {
    let timetableActivityListFound: TimetableActivityItem[] = [];
    const oldBookedEvent: BookedEvent =
      this.currentUserSig().bookingList.find(
        (bookedEvent: BookedEvent) =>
          bookedEvent.subjectItem.name === this.searchForm.controls['subject'].value.name &&
          bookedEvent.activityType === this.searchForm.controls['eventBooking'].value,
      ) || ({} as BookedEvent);
    if (Object.keys(oldBookedEvent).length) {
      this.roomListSig().forEach((room: Room) => {
        if (
          room.subjectList?.some(
            (roomSubject: SubjectItem) => roomSubject.name === this.searchForm.controls['subject'].value.name,
          )
        ) {
          room.timetable.forEach((timetableItem: TimeTableItem) => {
            timetableItem.activities?.forEach((timetableActivity: TimetableActivityItem) => {
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
    }

    console.log(timetableActivityListFound);

    timetableActivityListFound = timetableActivityListFound.filter((timetableActivity: TimetableActivityItem) =>
      timetableActivity.startHour !== oldBookedEvent.startHour
        ? timetableActivity.startHour !== oldBookedEvent.startHour
        : timetableActivity.date !== oldBookedEvent.date,
    );
    timetableActivityListFound = timetableActivityListFound.filter((timetableActivity: TimetableActivityItem) => {
      return new Date().setHours(0, 0, 0, 0) - new Date(timetableActivity.date).getTime() <= 0;
    });

    this.timetableActivityListFoundSig.set(timetableActivityListFound);
    this.searchActive$.set(true);
  }
}
