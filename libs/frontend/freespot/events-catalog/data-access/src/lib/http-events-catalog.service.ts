import { inject, Injectable } from '@angular/core';
import {
  BookingsHttpService,
  BuildingsHttpService,
  EventsHttpService,
  RoomsHttpService,
} from '@free-spot/api-client';
import {
  type EventsCatalogBooking,
  type EventsCatalogBuilding,
  type EventsCatalogEvent,
  type EventsCatalogRoom,
} from '@free-spot/events-catalog/domain';
import { forkJoin, map, Observable } from 'rxjs';
import {
  bookingDtoToDomain,
  buildingDtoToDomain,
  eventDtoToDomain,
  roomDtoToDomain,
} from './events-catalog.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpEventsCatalogService {
  private readonly eventsApi = inject(EventsHttpService);
  private readonly buildingsApi = inject(BuildingsHttpService);
  private readonly roomsApi = inject(RoomsHttpService);
  private readonly bookingsApi = inject(BookingsHttpService);

  loadCatalog$(): Observable<{
    events: EventsCatalogEvent[];
    buildings: EventsCatalogBuilding[];
    rooms: EventsCatalogRoom[];
    bookings: EventsCatalogBooking[];
  }> {
    return forkJoin({
      events: this.listSpecialEvents$(),
      buildings: this.listBuildings$(),
      rooms: this.listRooms$(),
      bookings: this.listBookings$(),
    });
  }

  private listSpecialEvents$(): Observable<EventsCatalogEvent[]> {
    return this.eventsApi.eventsGet().pipe(map((dtos) => (dtos ?? []).map(eventDtoToDomain)));
  }

  private listBuildings$(): Observable<EventsCatalogBuilding[]> {
    return this.buildingsApi.buildingsGet().pipe(map((dtos) => (dtos ?? []).map(buildingDtoToDomain)));
  }

  private listRooms$(): Observable<EventsCatalogRoom[]> {
    return this.roomsApi.roomsGet().pipe(map((dtos) => (dtos ?? []).map(roomDtoToDomain)));
  }

  private listBookings$(): Observable<EventsCatalogBooking[]> {
    return this.bookingsApi.bookingsGet().pipe(map((dtos) => (dtos ?? []).map(bookingDtoToDomain)));
  }
}
