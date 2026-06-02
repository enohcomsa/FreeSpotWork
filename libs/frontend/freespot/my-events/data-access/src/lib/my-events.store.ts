import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  type MyEventsBooking,
  type MyEventsBuilding,
  type MyEventsEvent,
  type MyEventsFloor,
  type MyEventsRoom,
} from '@free-spot/my-events/domain';
import { take } from 'rxjs';
import { HttpMyEventsService } from './http-my-events.service';

@Injectable({ providedIn: 'root' })
export class MyEventsStore {
  private readonly api = inject(HttpMyEventsService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly bookingsSig = signal<MyEventsBooking[]>([]);
  private readonly eventsSig = signal<MyEventsEvent[]>([]);
  private readonly buildingsSig = signal<MyEventsBuilding[]>([]);
  private readonly roomsSig = signal<MyEventsRoom[]>([]);
  private readonly floorsSig = signal<MyEventsFloor[]>([]);

  readonly bookings = computed<MyEventsBooking[]>(() =>
    this.bookingsSig().filter((booking) => booking.activityType === 'SPECIAL_EVENT'),
  );

  readonly bookedEvents = computed(() =>
    this.bookings()
      .map((booking) => {
        const event = booking.activityId
          ? this.eventsSig().find((item) => item.id === booking.activityId)
          : null;

        if (!event) {
          return null;
        }

        const room = event.roomId
          ? this.roomsSig().find((item) => item.id === event.roomId)
          : null;

        const building = event.buildingId
          ? this.buildingsSig().find((item) => item.id === event.buildingId)
          : null;

        const floor = room?.floorId
          ? this.floorsSig().find((item) => item.id === room.floorId)
          : null;

        return {
          booking,
          event,
          building: building ?? null,
          floor: floor ?? null,
          room: room ?? null,
        };
      })
      .filter((item): item is {
        booking: MyEventsBooking;
        event: MyEventsEvent;
        building: MyEventsBuilding | null;
        floor: MyEventsFloor | null;
        room: MyEventsRoom | null;
      } => item !== null),
  );

  load(): void {
    this.api
      .loadMyEvents$()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ bookings, events, buildings, rooms, floors }) => {
        this.bookingsSig.set(bookings);
        this.eventsSig.set(events);
        this.buildingsSig.set(buildings);
        this.roomsSig.set(rooms);
        this.floorsSig.set(floors);
      });
  }

  remove(id: string): void {
    this.api
      .deleteBooking$(id)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.bookingsSig.update((items) => items.filter((booking) => booking.id !== id));
      });
  }
}
