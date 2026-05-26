import { computed, inject, Injectable, signal } from '@angular/core';
import {
  type EventCardVm,
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

  private readonly eventListSig = signal<EventsCatalogEvent[]>([]);
  private readonly buildingListSig = signal<EventsCatalogBuilding[]>([]);
  private readonly roomListSig = signal<EventsCatalogRoom[]>([]);
  private readonly bookingListSig = signal<EventsCatalogBooking[]>([]);

  readonly registeredEventIdSetSig = computed<Set<string>>(() => {
    return new Set(this.bookingListSig().map((booking) => booking.activityId).filter((id): id is string => !!id));
  });

  readonly futureEventCardVmsSig = computed<EventCardVm[]>(() => {
    const now = Date.now();
    const registeredEventIds = this.registeredEventIdSetSig();

    return this.eventListSig()
      .filter((event) => new Date(event.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((event) => {
        const building = this.buildingListSig().find((item) => item.id === event.buildingId);
        const room = this.roomListSig().find((item) => item.id === event.roomId);

        const totalSpotsNumber = room?.totalSpotsNumber ?? 0;
        const unavailableSpots = room?.unavailableSpots ?? 0;
        const freeSpots = totalSpotsNumber - unavailableSpots - event.reservedSpots;

        return {
          id: event.id,
          name: event.name,
          date: event.date,
          buildingName: building?.name ?? '',
          buildingAddress: building?.address ?? '',
          roomName: room?.name ?? '',
          freeSpots,
          bookedSpots: totalSpotsNumber,
          reservedSpots: event.reservedSpots,
          isRegistered: registeredEventIds.has(event.id),
        };
      });
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
