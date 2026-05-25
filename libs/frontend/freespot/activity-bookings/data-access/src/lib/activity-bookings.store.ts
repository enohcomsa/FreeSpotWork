import { computed, inject, Injectable, signal } from '@angular/core';
import {
  type ActivityBooking,
  type ActivityBookingActivity,
  type ActivityBookingBuilding,
  type ActivityBookingCardVm,
  type ActivityBookingFloor,
  type ActivityBookingRoom,
  type ActivityBookingSubject,
} from '@free-spot/activity-bookings/domain';
import { take } from 'rxjs';
import { mapToActivityBookingVm } from './activity-booking.mapper';
import { HttpActivityBookingsService } from './http-activity-bookings.service';

@Injectable({ providedIn: 'root' })
export class ActivityBookingsStore {
  private readonly _api = inject(HttpActivityBookingsService);

  private readonly _bookings = signal<ActivityBooking[]>([]);
  private readonly _subjects = signal<ActivityBookingSubject[]>([]);
  private readonly _activities = signal<ActivityBookingActivity[]>([]);
  private readonly _rooms = signal<ActivityBookingRoom[]>([]);
  private readonly _buildings = signal<ActivityBookingBuilding[]>([]);
  private readonly _floors = signal<ActivityBookingFloor[]>([]);

  readonly bookings = computed<ActivityBooking[]>(() =>
    this._bookings().filter((booking) => booking.activityType !== 'SPECIAL_EVENT')
  );

  readonly bookingCards = computed<ActivityBookingCardVm[]>(() =>
    this.bookings()
      .map((booking) => {
        const activity = this._activities().find((item) => item.id === booking.activityId);

        if (!activity) {
          return null;
        }

        const subject = this._subjects().find((item) => item.id === activity.subjectId);
        const room = this._rooms().find((item) => item.id === activity.roomId);
        const building = this._buildings().find((item) => item.id === room?.buildingId);
        const floor = this._floors().find((item) => item.id === room?.floorId);

        if (!subject || !room || !building || !floor) {
          return null;
        }

        return mapToActivityBookingVm(booking, activity, subject, room, building, floor);
      })
      .filter((item): item is ActivityBookingCardVm => item !== null)
  );

  load(): void {
    this._api
      .loadActivityBookingsContext$()
      .pipe(take(1))
      .subscribe(({ bookings, subjects, timetableActivities, rooms, buildings, floors }) => {
        this._bookings.set(bookings);
        this._subjects.set(subjects);
        this._activities.set(timetableActivities);
        this._rooms.set(rooms);
        this._buildings.set(buildings);
        this._floors.set(floors);
      });
  }

  refresh(): void {
    this.load();
  }
}
