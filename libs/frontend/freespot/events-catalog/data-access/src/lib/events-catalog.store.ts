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
  private readonly _api = inject(HttpEventsCatalogService);

  private readonly _eventListSig = signal<EventsCatalogEvent[]>([]);
  private readonly _buildingListSig = signal<EventsCatalogBuilding[]>([]);
  private readonly _roomListSig = signal<EventsCatalogRoom[]>([]);
  private readonly _bookingListSig = signal<EventsCatalogBooking[]>([]);

  readonly registeredEventIdSetSig = computed(() => {
    return new Set(this._bookingListSig().map((booking) => booking.activityId).filter((id): id is string => !!id));
  });

  readonly futureEventCardVmsSig = computed<EventCardVm[]>(() => {
    const now = Date.now();
    const registeredEventIds = this.registeredEventIdSetSig();

    return this._eventListSig()
      .filter((event) => new Date(event.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((event) => {
        const building = this._buildingListSig().find((item) => item.id === event.buildingId);
        const room = this._roomListSig().find((item) => item.id === event.roomId);

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
    if (this._eventListSig().length) {
      return;
    }

    this._api
      .loadCatalog$()
      .pipe(take(1))
      .subscribe(({ events, buildings, rooms, bookings }) => {
        this._eventListSig.set(events);
        this._buildingListSig.set(buildings);
        this._roomListSig.set(rooms);
        this._bookingListSig.set(bookings);
      });
  }
}
