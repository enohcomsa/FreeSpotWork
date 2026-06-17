import { inject, Injectable } from '@angular/core';
import {
  BookingsHttpService,
  BuildingsHttpService,
  EventsHttpService,
  FloorsHttpService,
  RoomsHttpService,
} from '@free-spot/api-client';
import {
  type MyEventsBooking,
  type MyEventsBuilding,
  type MyEventsEvent,
  type MyEventsFloor,
  type MyEventsRoom,
} from '@free-spot/my-events/domain';
import { forkJoin, map, Observable } from 'rxjs';
import {
  bookingDtoToDomain,
  buildingDtoToDomain,
  eventDtoToDomain,
  floorDtoToDomain,
  roomDtoToDomain,
} from './my-events.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpMyEventsService {
  private readonly bookingsApi = inject(BookingsHttpService);
  private readonly eventsApi = inject(EventsHttpService);
  private readonly buildingsApi = inject(BuildingsHttpService);
  private readonly roomsApi = inject(RoomsHttpService);
  private readonly floorsApi = inject(FloorsHttpService);

  loadMyEvents$(): Observable<{
    bookings: MyEventsBooking[];
    events: MyEventsEvent[];
    buildings: MyEventsBuilding[];
    rooms: MyEventsRoom[];
    floors: MyEventsFloor[];
  }> {
    return forkJoin({
      bookings: this.listBookings$(),
      events: this.listEvents$(),
      buildings: this.listBuildings$(),
      rooms: this.listRooms$(),
      floors: this.listFloors$(),
    });
  }

  deleteBooking$(id: string): Observable<void> {
    return this.bookingsApi.bookingsIdDelete({ id }).pipe(map(() => void 0));
  }

  private listBookings$(): Observable<MyEventsBooking[]> {
    return this.bookingsApi.bookingsGet().pipe(map((dtos) => (dtos ?? []).map(bookingDtoToDomain)));
  }

  private listEvents$(): Observable<MyEventsEvent[]> {
    return this.eventsApi.eventsGet().pipe(map((dtos) => (dtos ?? []).map(eventDtoToDomain)));
  }

  private listBuildings$(): Observable<MyEventsBuilding[]> {
    return this.buildingsApi.buildingsGet().pipe(map((dtos) => (dtos ?? []).map(buildingDtoToDomain)));
  }

  private listRooms$(): Observable<MyEventsRoom[]> {
    return this.roomsApi.roomsGet().pipe(map((dtos) => (dtos ?? []).map(roomDtoToDomain)));
  }

  private listFloors$(): Observable<MyEventsFloor[]> {
    return this.floorsApi.floorsGet().pipe(map((dtos) => (dtos ?? []).map(floorDtoToDomain)));
  }
}
