import { computed, inject, Injectable, signal } from '@angular/core';
import {
  type EventsCatalogBooking,
  type EventsCatalogBuilding,
  type EventsCatalogEvent,
  type EventsCatalogRoom,
} from '@free-spot/events-catalog/domain';
import { take } from 'rxjs';
import { HttpEventsCatalogService } from './http-events-catalog.service';

@Injectable()
export class EventsCatalogStore {
  private readonly api = inject(HttpEventsCatalogService);

  readonly buildingListSig = signal<EventsCatalogBuilding[]>([]);
  readonly roomListSig = signal<EventsCatalogRoom[]>([]);

  private readonly eventListSig = signal<EventsCatalogEvent[]>([]);
  private readonly bookingListSig = signal<EventsCatalogBooking[]>([]);

  readonly registeredEventIdSetSig = computed<Set<string>>(() => {
    return new Set(this.bookingListSig().map((booking) => booking.activityId).filter((id): id is string => !!id));
  });

  readonly futureEventListSig = computed<EventsCatalogEvent[]>(() => {
    const now = Date.now();

    return this.eventListSig()
      .filter((event) => new Date(event.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  init(): void {
    if (this.eventListSig().length) {
      return;
    }

    this.api
      .loadCatalog$()
      .pipe(take(1))
      .subscribe(({ events, buildings, rooms, bookings }) => {
        this.eventListSig.set(events);
        this.buildingListSig.set(buildings);
        this.roomListSig.set(rooms);
        this.bookingListSig.set(bookings);
      });
  }
}
