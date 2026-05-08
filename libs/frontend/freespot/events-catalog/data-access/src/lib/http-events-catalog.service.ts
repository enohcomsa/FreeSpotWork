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
  dtoToEventsCatalogBooking,
  dtoToEventsCatalogBuilding,
  dtoToEventsCatalogEvent,
  dtoToEventsCatalogRoom,
} from './events-catalog.dto.mapper';

@Injectable({
  providedIn: 'root',
})
export class HttpEventsCatalogService {
  private readonly _eventsApi = inject(EventsHttpService);
  private readonly _buildingsApi = inject(BuildingsHttpService);
  private readonly _roomsApi = inject(RoomsHttpService);
  private readonly _bookingsApi = inject(BookingsHttpService);

  listSpecialEvents$(): Observable<EventsCatalogEvent[]> {
    return this._eventsApi.eventsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToEventsCatalogEvent)));
  }

  listBuildings$(): Observable<EventsCatalogBuilding[]> {
    return this._buildingsApi.buildingsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToEventsCatalogBuilding)));
  }

  listRooms$(): Observable<EventsCatalogRoom[]> {
    return this._roomsApi.roomsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToEventsCatalogRoom)));
  }

  listBookings$(): Observable<EventsCatalogBooking[]> {
    return this._bookingsApi.bookingsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToEventsCatalogBooking)));
  }

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
}
