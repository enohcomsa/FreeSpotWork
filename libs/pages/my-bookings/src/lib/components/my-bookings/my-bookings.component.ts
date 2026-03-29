import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal, WritableSignal, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormComponent } from '@free-spot/ui';
import { BookedSpotComponent } from '../booked-spot/booked-spot.component';

import { Booking } from '@free-spot-domain/booking';
import { BookingService } from '@free-spot-service/booking';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { SubjectService } from '@free-spot-service/subject';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';
import { AdminRoomService } from '@free-spot-service/room';
import { BuildingService } from '@free-spot-service/building';
import { AdminFloorService } from '@free-spot-service/floor';
import { ActivityType } from '@free-spot/enums';

@Component({
  selector: 'free-spot-my-bookings',
  imports: [MatChipsModule, DynamicFormComponent, BookedSpotComponent, TranslateModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent implements OnInit {
  private readonly _bookingService = inject(BookingService);
  private readonly _confirmService = inject(ConfirmModalService);
  private readonly _subjectService = inject(SubjectService);
  private readonly _timetableActivityService = inject(AdminTimetableActivityService);
  private readonly _roomService = inject(AdminRoomService);
  private readonly _buildingService = inject(BuildingService);
  private readonly _floorService = inject(AdminFloorService);

  ACTICITY_TYPE = ActivityType;

  private readonly _eventFilter: WritableSignal<ActivityType | null> = signal(null);

  bookingListSig = this._bookingService.bookingListSig;
  normalBookingListSig = this._bookingService.normalBookingListSig;
  specialEventBookingListSig = this._bookingService.specialEventBookingListSig;
  selectedBookingIdSig = this._bookingService.selectedBookingIdSig;

  filteredBookedItemsSig: Signal<Booking[]> = computed(() => {
    const filter = this._eventFilter();
    const bookings = this.normalBookingListSig();

    if (!filter) {
      return bookings;
    }

    return bookings.filter((booking: Booking) => booking.activityType === filter);
  });

  ngOnInit(): void {
    this._subjectService.init();
    this._timetableActivityService.init();
    this._roomService.init();
    this._buildingService.init();
    this._floorService.init();
    this._bookingService.init();
  }

  filterActiveBookedItems(event: ActivityType, all: boolean): void {
    if (all) {
      this._eventFilter.set(null);
    } else {
      this._eventFilter.set(event);
    }
  }

  selectBooking(bookingId: string): void {
    this._bookingService.selectBooking(bookingId);
  }

  deleteSpecialEvent(bookingId: string): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to remove this booking?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this._bookingService.removeSpecialEventBooking(bookingId);
        }
      });
  }
}
