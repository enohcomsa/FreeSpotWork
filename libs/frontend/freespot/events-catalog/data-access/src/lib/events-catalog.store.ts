import { computed, inject, Injectable, signal } from '@angular/core';
import { take } from 'rxjs';

import { SpecialEvent } from '@free-spot-domain/event';
import { BuildingService } from '@free-spot-service/building';
import { BookingService } from '@free-spot-service/booking';
import { AdminRoomService } from '@free-spot-service/room';
import { HttpEventService } from '@http-free-spot/event';
import { EventCardVm } from '@free-spot/events-catalog/domain';

@Injectable()
export class EventsCatalogStore {
  private readonly _httpEventService = inject(HttpEventService);
  private readonly _buildingService = inject(BuildingService);
  private readonly _roomService = inject(AdminRoomService);
  private readonly _bookingService = inject(BookingService);

  private readonly _eventListSig = signal<SpecialEvent[]>([]);
  readonly eventListSig = this._eventListSig.asReadonly();

  readonly registeredEventIdSetSig = computed(() => {
    const bookings = this._bookingService.specialEventBookingListSig();

    return new Set(
      bookings
        .map((booking) => booking.activityId)
        .filter((id): id is string => !!id)
    );
  });

  readonly futureEventCardVmsSig = computed<EventCardVm[]>(() => {
    const now = Date.now();
    const registeredEventIds = this.registeredEventIdSetSig();

    return this._eventListSig()
      .filter((event) => !!event.date)
      .filter((event) => new Date(event.date as string).getTime() > now)
      .sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime())
      .map((event) => {
        const building = this._buildingService.getSignalById(event.buildingId)();
        const room = this._roomService.getSignalById(event.roomId)();

        const freeSpots =
          room.totalSpotsNumber - room.unavailableSpots - event.reservedSpots;

        return {
          id: event.id,
          name: event.name,
          date: event.date as string,
          buildingName: building.name,
          buildingAddress: building.address,
          roomName: room.name,
          freeSpots,
          bookedSpots: room.totalSpotsNumber,
          reservedSpots: event.reservedSpots,
          isRegistered: registeredEventIds.has(event.id),
        };
      });
  });

  init(): void {
    this._buildingService.init();
    this._roomService.init();
    this._bookingService.init();

    if (this._eventListSig().length) {
      return;
    }

    this._httpEventService
      .listSpecialEvents$()
      .pipe(take(1))
      .subscribe((events: SpecialEvent[]) => {
        this._eventListSig.set(events);
      });
  }
}
