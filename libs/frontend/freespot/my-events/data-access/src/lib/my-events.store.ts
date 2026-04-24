import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { Booking } from '@free-spot-domain/booking';
import { ActivityType } from '@frontend/freespot/schedule/domain';
import { HttpBookingService } from '@http-free-spot/booking';
import { AdminEventService } from '@free-spot-service/event';
import { BuildingService } from '@free-spot-service/building';
import { AdminRoomService } from '@free-spot-service/room';
import { AdminFloorService } from '@free-spot-service/floor';
import { mapToMyEventVm } from './my-event.mapper';

@Injectable({ providedIn: 'root' })
export class MyEventsStore {
  private readonly api = inject(HttpBookingService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly eventService = inject(AdminEventService);
  private readonly buildingService = inject(BuildingService);
  private readonly roomService = inject(AdminRoomService);
  private readonly floorService = inject(AdminFloorService);

  private readonly _bookings = signal<Booking[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly bookings = computed(() =>
    this._bookings().filter((booking) => booking.activityType === ActivityType.SPECIAL_EVENT)
  );

  readonly eventCards = computed(() =>
    this.bookings()
      .map((booking) => {
        const event = booking.activityId
          ? this.eventService.getSignalById(booking.activityId)()
          : null;

        if (!event?.id) {
          return null;
        }

        const room = event.roomId
          ? this.roomService.getSignalById(event.roomId)()
          : null;

        const building = event.buildingId
          ? this.buildingService.getSignalById(event.buildingId)()
          : null;

        const floor = room?.floorId
          ? this.floorService.getSignalById(room.floorId)()
          : null;

        return mapToMyEventVm(
          booking,
          event,
          building ?? ({} as never),
          floor ?? ({} as never),
          room ?? ({} as never)
        );
      })
      .filter((item) => item !== null)
  );

  load(): void {
    this.eventService.init();
    this.buildingService.init();
    this.roomService.init();
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
          this._error.set('Failed to load event bookings');
          this._loading.set(false);
        },
      });
  }

  remove(id: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.api
      .deleteBooking$(id)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this._bookings.update((items) => items.filter((booking) => booking.id !== id));
          this._loading.set(false);
        },
        error: () => {
          this._error.set('Failed to delete booking');
          this._loading.set(false);
        },
      });
  }
}
