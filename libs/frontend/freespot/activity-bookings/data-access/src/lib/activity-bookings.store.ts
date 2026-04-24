import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpBookingService } from '@http-free-spot/booking';
import { Booking } from '@free-spot-domain/booking';
import { ActivityType, TimetableActivity } from '@frontend/freespot/schedule/domain';
import { take } from 'rxjs';
import { SubjectService } from '@free-spot-service/subject';
import { AdminTimetableActivityService } from '@frontend/freespot/schedule/data-access';
import { AdminRoomService } from '@free-spot-service/room';
import { BuildingService } from '@free-spot-service/building';
import { AdminFloorService } from '@free-spot-service/floor';
import { mapToActivityBookingVm } from './activity-booking.mapper';

@Injectable({ providedIn: 'root' })
export class ActivityBookingsStore {
  private readonly api = inject(HttpBookingService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly subjectService = inject(SubjectService);
  private readonly timetableActivityService = inject(AdminTimetableActivityService);
  private readonly roomService = inject(AdminRoomService);
  private readonly buildingService = inject(BuildingService);
  private readonly floorService = inject(AdminFloorService);

  private readonly _bookings = signal<Booking[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly bookings = computed(() =>
    this._bookings().filter((booking) => booking.activityType !== ActivityType.SPECIAL_EVENT)
  );

  readonly bookingCards = computed(() =>
    this.bookings()
      .map((booking) => {
        const activity = booking.activityId
          ? this.timetableActivityService.getSignalById(booking.activityId)()
          : null;

        if (!activity?.id) {
          return null;
        }

        const subject = activity.subjectId
          ? this.subjectService.getSignalById(activity.subjectId)()
          : null;

        const room = activity.roomId
          ? this.roomService.getSignalById(activity.roomId)()
          : null;

        const building = room?.buildingId
          ? this.buildingService.getSignalById(room.buildingId)()
          : null;

        const floor = room?.floorId
          ? this.floorService.getSignalById(room.floorId)()
          : null;

        return mapToActivityBookingVm(
          booking,
          activity as TimetableActivity,
          subject ?? ({} as never),
          room ?? ({} as never),
          building ?? ({} as never),
          floor ?? ({} as never)
        );
      })
      .filter((item) => item !== null)
  );

  load(): void {
    this.subjectService.init();
    this.timetableActivityService.init();
    this.roomService.init();
    this.buildingService.init();
    this.floorService.init();

    this._loading.set(true);
    this._error.set(null);

    this.api
      .listBookings$()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (bookings) => {
          this._bookings.set(bookings);
          this._loading.set(false);
        },
        error: () => {
          this._error.set('Failed to load bookings');
          this._loading.set(false);
        },
      });
  }

  refresh(): void {
    this.load();
  }
}
