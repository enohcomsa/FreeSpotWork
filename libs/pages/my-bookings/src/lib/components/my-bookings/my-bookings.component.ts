import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { DynamicFormComponent } from '@free-spot/ui';
import { BookedSpotComponent } from '../booked-spot/booked-spot.component';
import { UserService } from '@free-spot-service/user';
import { BookedEvent, FreeSpotDate, FreeSpotUser } from '@free-spot/models';
import { AppDateService } from '@free-spot-service/app-date';
import { WeekParity } from '@free-spot/enums';

@Component({
  selector: 'free-spot-my-bookings',
  standalone: true,
  imports: [CommonModule, MatChipsModule, DynamicFormComponent, BookedSpotComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent implements OnInit {
  private _userService: UserService = inject(UserService);
  private _appDateService: AppDateService = inject(AppDateService);

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

  filteredBookedItems: Signal<BookedEvent[]> = computed(() => {
    let bookedEventList: BookedEvent[] = this.currentUserSig().bookingList;
    bookedEventList = bookedEventList?.filter((bookedEvent: BookedEvent) =>
      bookedEvent.weekParity === this.weekParitySig() &&
      new Date().setHours(0, 0, 0, 0) - new Date(bookedEvent.date).getTime() <= 0 &&
      new Date().setHours(0, 0, 0, 0) - new Date(bookedEvent.date).getTime() === 0
        ? new Date().getHours() < bookedEvent.startHour
        : true,
    );
    return bookedEventList;
  });

  ngOnInit(): void {
    this._userService.init();
    this._appDateService.init();
  }
}
