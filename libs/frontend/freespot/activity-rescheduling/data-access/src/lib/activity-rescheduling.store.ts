import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable, of, switchMap, take } from 'rxjs';
import {
  type ActivityRescheduleBookingCmd,
  type ActivityReschedulingActivity,
  type ActivityReschedulingBooking,
  type ActivityReschedulingBuilding,
  type ActivityReschedulingFloor,
  type ActivityReschedulingOptionsResult,
  type ActivityReschedulingRoom,
  type ActivityReschedulingSubject,
} from '@free-spot/activity-rescheduling/domain';
import { HttpActivityReschedulingService } from './http-activity-rescheduling.service';

@Injectable({ providedIn: 'root' })
export class ActivityReschedulingStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _api = inject(HttpActivityReschedulingService);

  private readonly _rescheduleOptions = signal<ActivityReschedulingOptionsResult | null>(null);
  private readonly _selectedBookingId = signal<string | null>(null);

  private readonly _bookings = signal<ActivityReschedulingBooking[]>([]);
  readonly subjects = signal<ActivityReschedulingSubject[]>([]);
  readonly activities = signal<ActivityReschedulingActivity[]>([]);
  readonly rooms = signal<ActivityReschedulingRoom[]>([]);
  readonly floors = signal<ActivityReschedulingFloor[]>([]);
  readonly buildings = signal<ActivityReschedulingBuilding[]>([]);
  readonly rescheduleOptions = this._rescheduleOptions.asReadonly();
  readonly reschedulableBookings = computed(() =>
    this._bookings().filter((booking) => {
      if (booking.activityType === 'SPECIAL_EVENT') {
        return false;
      }

      if (!booking.groupCohortId && !booking.semigroupCohortId) {
        return false;
      }

      const activity = this.activities().find((activity) => activity.id === booking.activityId);

      if (!activity?.date) {
        return false;
      }

      const start = new Date(activity.date);
      start.setHours(activity.startHour, 0, 0, 0);

      return start.getTime() > Date.now();
    }),
  );


  load(): void {
    this._api
      .loadActivityReschedulingContext$()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ bookings, subjects, activities, rooms, buildings, floors }) => {
        this._bookings.set(bookings);
        this.subjects.set(subjects);
        this.activities.set(activities);
        this.rooms.set(rooms);
        this.buildings.set(buildings);
        this.floors.set(floors);
      });
  }

  selectBooking(id: string | null): void {
    this._selectedBookingId.set(id);

    if (!id) {
      this._rescheduleOptions.set(null);
    }
  }

  loadOptions(): void {
    const id = this._selectedBookingId();

    if (!id) {
      return;
    }
console.log(id);

    this._api
      .getRescheduleOptions$(id)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this._rescheduleOptions.set(result);
      });
  }

  clearOptions(): void {
    this._rescheduleOptions.set(null);
  }

  rescheduleBooking(activityId: string): Observable<boolean> {
    const bookingId = this._selectedBookingId();

    if (!bookingId) {
      return of(false);
    }

    const cmd: ActivityRescheduleBookingCmd = { activityId };

    return this._api.rescheduleBooking$(bookingId, cmd).pipe(
      switchMap(() => this._api.loadActivityReschedulingContext$()),
      take(1),
      map(({ bookings, subjects, activities, rooms, buildings, floors }) => {
        this._bookings.set(bookings);
        this.subjects.set(subjects);
        this.activities.set(activities);
        this.rooms.set(rooms);
        this.buildings.set(buildings);
        this.floors.set(floors);

        this._selectedBookingId.set(null);
        this._rescheduleOptions.set(null);

        return true;
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
