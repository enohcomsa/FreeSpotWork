import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';

import { MatChipsModule } from '@angular/material/chips';
import { DynamicFormComponent } from '@free-spot/ui';
import { BookedSpotComponent } from '../booked-spot/booked-spot.component';
import { UserService } from '@free-spot-service/user';
import { BookedEvent, FreeSpotDate, FreeSpotUser } from '@free-spot/models';
import { AppDateService } from '@free-spot-service/app-date';
import { Event, WeekParity } from '@free-spot/enums';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { AdminEventService } from '@free-spot-service/event';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-my-bookings',

  imports: [MatChipsModule, DynamicFormComponent, BookedSpotComponent, TranslateModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent implements OnInit {
  private _userService: UserService = inject(UserService);
  private _appDateService: AppDateService = inject(AppDateService);
  private _adminEventService: AdminEventService = inject(AdminEventService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);

  private _currentUserEmail = (
    JSON.parse(localStorage.getItem('user') as string) as {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    }
  ).email;
  currentUserSig: Signal<FreeSpotUser> = this._userService.getFreeSpotUserByEmail(this._currentUserEmail);
  appDateSig: Signal<FreeSpotDate> = this._appDateService.appDateSig;
  weekParitySig: Signal<WeekParity> = computed(() => {
    if (this.appDateSig().weekCount % 2 === 0) {
      return WeekParity.EVEN;
    } else {
      return WeekParity.ODD;
    }
  });
  private _activeBookedItemsSig: Signal<BookedEvent[]> = computed(() => {
    let bookedEventList: BookedEvent[] = this.currentUserSig().bookingList;
    bookedEventList = bookedEventList?.filter((bookedEvent: BookedEvent) => {
      return (
        (bookedEvent.weekParity === this.weekParitySig() || bookedEvent.weekParity === WeekParity.BOTH) &&
        new Date().setHours(0, 0, 0, 0) - new Date(bookedEvent.date).getTime() <= 0 &&
        (new Date().setHours(0, 0, 0, 0) - new Date(bookedEvent.date).getTime() === 0
          ? new Date().getHours() < bookedEvent.startHour
          : true)
      );
    });

    bookedEventList = bookedEventList?.sort((event1, event2) => this._sortEventsByDate(event1, event2));
    return bookedEventList;
  });

  activeSpecialEventBookedItemListSig: Signal<BookedEvent[]> = computed(() => {
    let bookedEventList: BookedEvent[] = this.currentUserSig().eventList || [];
    (bookedEventList = bookedEventList?.filter(
      (bookedEvent: BookedEvent) => new Date().getTime() - new Date(bookedEvent.date as Date).getTime() <= 0,
    )),
      (bookedEventList = bookedEventList?.sort((event1, event2) => this._sortEventsByDate(event1, event2)));
    return bookedEventList;
  });

  private _eventFilter: WritableSignal<Event | null> = signal(null);

  filteredBookedItemsSig: Signal<BookedEvent[]> = computed(() => {
    let bookedEventList: BookedEvent[] = this._activeBookedItemsSig();

    if (this._eventFilter() !== null) {
      bookedEventList = bookedEventList = bookedEventList?.filter(
        (bookedEvent: BookedEvent) => bookedEvent.activityType === this._eventFilter(),
      );
    }

    return bookedEventList;
  });
  EVENT = Event;

  filterActiveBookedItems(event: Event, all: boolean): void {
    if (all) {
      this._eventFilter.set(null);
    } else {
      this._eventFilter.set(event);
    }
  }

  ngOnInit(): void {
    this._userService.init();
    this._appDateService.init();
    this._adminEventService.init();
  }

  deleteSpecialEvent(deletedSpecialEvent: BookedEvent): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to remove this booking?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          const updatedUser: FreeSpotUser = {
            ...this.currentUserSig(),
            eventList: this.currentUserSig().eventList?.filter((event: BookedEvent) => event.name !== deletedSpecialEvent.name),
          };

          this._adminEventService.updateEventSpots(deletedSpecialEvent.name as string, false);
          this._userService.updateFreeSpotUser(this.currentUserSig(), updatedUser);
        }
      });
  }

  private _sortEventsByDate(event1: BookedEvent, event2: BookedEvent): number {
    const date1: Date = new Date(event1.date);
    const date2: Date = new Date(event2.date);
    if (date1.getTime() === date2.getTime()) {
      return event1.startHour - event2.startHour;
    } else {
      return date1.getTime() - date2.getTime();
    }
  }
}
