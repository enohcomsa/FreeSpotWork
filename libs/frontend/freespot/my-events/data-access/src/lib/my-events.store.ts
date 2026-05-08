import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import {
  MyEventsActivityType,
  type MyEventCardVm,
  type MyEventsBooking,
  type MyEventsBuilding,
  type MyEventsEvent,
  type MyEventsFloor,
  type MyEventsRoom,
} from '@free-spot/my-events/domain';
import { mapToMyEventVm } from './my-event.mapper';
import { HttpMyEventsService } from './http-my-events.service';

@Injectable({ providedIn: 'root' })
export class MyEventsStore {
  private readonly _api = inject(HttpMyEventsService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _bookings = signal<MyEventsBooking[]>([]);
  private readonly _events = signal<MyEventsEvent[]>([]);
  private readonly _buildings = signal<MyEventsBuilding[]>([]);
  private readonly _rooms = signal<MyEventsRoom[]>([]);
  private readonly _floors = signal<MyEventsFloor[]>([]);

  readonly bookings = computed(() =>
    this._bookings().filter((b) => b.activityType === MyEventsActivityType.SPECIAL_EVENT)
  );

  readonly eventCards = computed<MyEventCardVm[]>(() =>
    this.bookings()
      .map((booking) => {
        const event = booking.activityId
          ? this._events().find((e) => e.id === booking.activityId)
          : null;

        if (!event) return null;

        const room = event.roomId
          ? this._rooms().find((r) => r.id === event.roomId)
          : null;

        const building = event.buildingId
          ? this._buildings().find((b) => b.id === event.buildingId)
          : null;

        const floor = room?.floorId
          ? this._floors().find((f) => f.id === room.floorId)
          : null;

        return mapToMyEventVm(
          booking,
          event,
          building ?? ({} as never),
          floor ?? ({} as never),
          room ?? ({} as never)
        );
      })
      .filter((x): x is MyEventCardVm => x !== null)
  );

  load(): void {
    this._api
      .loadMyEvents$()
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(({ bookings, events, buildings, rooms, floors }) => {
        this._bookings.set(bookings);
        this._events.set(events);
        this._buildings.set(buildings);
        this._rooms.set(rooms);
        this._floors.set(floors);
      });
  }

  remove(id: string): void {
    this._api
      .deleteBooking$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._bookings.update((items) => items.filter((b) => b.id !== id));
      });
  }
}
