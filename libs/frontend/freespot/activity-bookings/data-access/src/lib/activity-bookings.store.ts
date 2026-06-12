import { computed, inject, Injectable, signal } from '@angular/core';
import {
  type ActivityBooking,
  type ActivityBookingActivity,
  type ActivityBookingBuilding,
  type ActivityBookingFloor,
  type ActivityBookingRoom,
  type ActivityBookingSubject,
} from '@free-spot/activity-bookings/domain';
import { take } from 'rxjs';
import { HttpActivityBookingsService } from './http-activity-bookings.service';

@Injectable({ providedIn: 'root' })
export class ActivityBookingsStore {
  private readonly _api = inject(HttpActivityBookingsService);

  private readonly _bookings = signal<ActivityBooking[]>([]);
  readonly subjects = signal<ActivityBookingSubject[]>([]);
  readonly activities = signal<ActivityBookingActivity[]>([]);
  readonly rooms = signal<ActivityBookingRoom[]>([]);
  readonly buildings = signal<ActivityBookingBuilding[]>([]);
  readonly floors = signal<ActivityBookingFloor[]>([]);

  readonly bookings = computed<ActivityBooking[]>(() =>
    this._bookings().filter((booking) => booking.activityType !== 'SPECIAL_EVENT')
  );

  load(): void {
    this._api
      .loadActivityBookingsContext$()
      .pipe(take(1))
      .subscribe(({ bookings, subjects, timetableActivities, rooms, buildings, floors }) => {
        this._bookings.set(bookings);
        this.subjects.set(subjects);
        this.activities.set(timetableActivities);
        this.rooms.set(rooms);
        this.buildings.set(buildings);
        this.floors.set(floors);
      });
  }

  refresh(): void {
    this.load();
  }
}
