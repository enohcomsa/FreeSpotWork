import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, OnInit, output, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BookedEvent, FreeSpotUser, TimetableActivityItem } from '@free-spot/models';
import { Event, WeekParity } from '@free-spot/enums';
import { BookingService } from '@free-spot-service/booking';
import { UserService } from '@free-spot-service/user';

@Component({
  selector: 'free-spot-booking-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './booking-item.component.html',
  styleUrl: './booking-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingItemComponent implements OnInit {
  private _bookingService: BookingService = inject(BookingService);
  private _userService: UserService = inject(UserService);

  timetableActivitySig: InputSignal<TimetableActivityItem> = input.required<TimetableActivityItem>();
  oldTimetableActivitySig: InputSignal<TimetableActivityItem> = input.required<TimetableActivityItem>();
  bookingActive = output<boolean>();
  eventBookingSig: Signal<BookedEvent> = computed(() => this._bookingService.generateBooking(this.timetableActivitySig()));

  private _currentUserEmail = (
    JSON.parse(localStorage.getItem('user') as string) as {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    }
  ).email;

  currentUserSig: Signal<FreeSpotUser> = this._userService.getFreeSpotUserByEmail(this._currentUserEmail);
  event_learn: BookedEvent = {
    weekParity: WeekParity.BOTH,

    activityType: Event.LABORATORY,
    subjectItem: {
      name: 'Sist. optoelectronice in telecomunicatii ',
      shortName: 'SOT',
    },
    date: new Date('2024-7-15'),
    startHour: 8,
    endHour: 10,
    buildingName: 'Laboratoare Observatorrrrrrrrrrrrrrrrr',
    floorName: '5th',
    roomName: '519',
  };
  event_special: BookedEvent = {
    weekParity: WeekParity.BOTH,
    activityType: Event.SPECIAL_EVENT,
    subjectItem: {
      name: 'Sist. optoelectronice in telecomunicatii ',
      shortName: 'SOT',
    },
    date: new Date('2024-7-15'),
    startHour: 14,
    endHour: 16,
    buildingName: 'Baritiu corp A',
    floorName: '1st',
    roomName: '329',
  };

  ngOnInit(): void {
    this._bookingService.init();
    this._userService.init();
  }

  bookSpot(): void {
    this._bookingService.generateUserBookedItemByActivity(this.oldTimetableActivitySig(), false, true);
    this._bookingService.generateUserBookedItemByActivity(this.timetableActivitySig(), true, true);

    const oldBookedEvent: BookedEvent =
      this.currentUserSig().bookingList.find(
        (bookedEvent: BookedEvent) =>
          bookedEvent.subjectItem.name === this.oldTimetableActivitySig().subjectItem.name &&
          bookedEvent.activityType === this.oldTimetableActivitySig().activityType,
      ) || ({} as BookedEvent);

    const newUserBookingList: FreeSpotUser = {
      ...this.currentUserSig(),
      bookingList: this.currentUserSig().bookingList
        ? [
            ...this.currentUserSig().bookingList.filter(
              (bookedEvent: BookedEvent) => !this._checkBookedEventEquality(bookedEvent, oldBookedEvent),
            ),
            this.eventBookingSig(),
          ]
        : [this.eventBookingSig()],
    };

    this._userService.updateFreeSpotUser(this.currentUserSig(), newUserBookingList);
    this.bookingActive.emit(false);
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
