import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivityBookingActivityType,
  type ActivityBooking,
  type ActivityBookingActivity,
  type ActivityBookingBuilding,
  type ActivityBookingFloor,
  type ActivityBookingRoom,
  type ActivityBookingSubject,
} from '@free-spot/activity-bookings/domain';
import { forkJoin, take } from 'rxjs';
import { mapToActivityBookingVm } from './activity-booking.mapper';
import { HttpActivityBookingsService } from './http-activity-bookings.service';

@Injectable({ providedIn: 'root' })
export class ActivityBookingsStore {
  private readonly _api = inject(HttpActivityBookingsService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _bookings = signal<ActivityBooking[]>([]);
  private readonly _subjects = signal<ActivityBookingSubject[]>([]);
  private readonly _activities = signal<ActivityBookingActivity[]>([]);
  private readonly _rooms = signal<ActivityBookingRoom[]>([]);
  private readonly _buildings = signal<ActivityBookingBuilding[]>([]);
  private readonly _floors = signal<ActivityBookingFloor[]>([]);

  readonly bookings = computed(() =>
    this._bookings().filter((booking) => booking.activityType !== ActivityBookingActivityType.SPECIAL_EVENT)
  );

  readonly bookingCards = computed(() =>
    this.bookings()
      .map((booking) => {
        const activity = this._activities().find((item) => item.id === booking.activityId);

        if (!activity?.id) {
          return null;
        }

        const subject = this._subjects().find((item) => item.id === activity.subjectId);
        const room = this._rooms().find((item) => item.id === activity.roomId);
        const building = this._buildings().find((item) => item.id === room?.buildingId);
        const floor = this._floors().find((item) => item.id === room?.floorId);

        return mapToActivityBookingVm(
          booking,
          activity,
          subject ?? ({} as ActivityBookingSubject),
          room ?? ({} as ActivityBookingRoom),
          building ?? ({} as ActivityBookingBuilding),
          floor ?? ({} as ActivityBookingFloor)
        );
      })
      .filter((item) => item !== null)
  );

  load(): void {
    forkJoin({
      bookings: this._api.listBookings$(),
      subjects: this._api.listSubjects$(),
      activities: this._api.listTimetableActivities$(),
      rooms: this._api.listRooms$(),
      buildings: this._api.listBuildings$(),
      floors: this._api.listFloors$(),
    })
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(({ bookings, subjects, activities, rooms, buildings, floors }) => {
        this._bookings.set(bookings);
        this._subjects.set(subjects);
        this._activities.set(activities);
        this._rooms.set(rooms);
        this._buildings.set(buildings);
        this._floors.set(floors);
      });
  }

  refresh(): void {
    this.load();
  }
}
