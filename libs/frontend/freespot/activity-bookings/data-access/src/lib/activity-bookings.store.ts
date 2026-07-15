import { computed, inject, Injectable, signal } from '@angular/core';
import {
  BookingRangeFilter,
  type ActivityBooking,
  type ActivityBookingActivity,
  type ActivityBookingBuilding,
  type ActivityBookingFloor,
  type ActivityBookingRoom,
  type ActivityBookingSubject,
} from '@free-spot/activity-bookings/domain';
import { take } from 'rxjs';
import { HttpActivityBookingsService } from './http-activity-bookings.service';
import { addDays, getActivityStartDate, getWeekStart } from './date.helper';

@Injectable({ providedIn: 'root' })
export class ActivityBookingsStore {
  private readonly _api = inject(HttpActivityBookingsService);
  private readonly _bookings = signal<ActivityBooking[]>([]);

  readonly subjects = signal<ActivityBookingSubject[]>([]);
  readonly activities = signal<ActivityBookingActivity[]>([]);
  readonly rooms = signal<ActivityBookingRoom[]>([]);
  readonly buildings = signal<ActivityBookingBuilding[]>([]);
  readonly floors = signal<ActivityBookingFloor[]>([]);

  readonly selectedBookingRanges = signal<BookingRangeFilter[]>([
    'THIS_WEEK_FUTURE',
  ]);

  readonly visibleBookings = computed<ActivityBooking[]>(() => {
    const selected = new Set(this.selectedBookingRanges());

    const activitiesById = new Map(
      this.activities().map((activity) => [activity.id, activity]),
    );

    const now = new Date();
    const currentWeekStart = getWeekStart(now);
    const nextWeekStart = addDays(currentWeekStart, 7);
    const weekAfterNextStart = addDays(currentWeekStart, 14);

    return this._bookings()
      .filter((booking) => booking.activityType !== 'SPECIAL_EVENT')
      .filter((booking) => {
        const activity = activitiesById.get(booking.activityId);
        if (!activity) return false;

        const start = getActivityStartDate(activity);

        return (
          (selected.has('THIS_WEEK_FUTURE') &&
            start >= now &&
            start < nextWeekStart) ||
          (selected.has('THIS_WEEK_PAST') &&
            start >= currentWeekStart &&
            start < now) ||
          (selected.has('NEXT_WEEK') &&
            start >= nextWeekStart &&
            start < weekAfterNextStart)
        );
      })
      .sort((a, b) => {
        const activityA = activitiesById.get(a.activityId);
        const activityB = activitiesById.get(b.activityId);

        if (!activityA || !activityB) return 0;

        return (
          getActivityStartDate(activityA).getTime() -
          getActivityStartDate(activityB).getTime()
        );
      });
  });

  setBookingRangeFilters(filters: BookingRangeFilter[]): void {
    this.selectedBookingRanges.set(filters);
  }

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
