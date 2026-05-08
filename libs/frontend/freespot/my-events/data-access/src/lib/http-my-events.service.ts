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
  dtoToMyEventsBooking,
  dtoToMyEventsBuilding,
  dtoToMyEventsEvent,
  dtoToMyEventsFloor,
  dtoToMyEventsRoom,
} from './my-events.dto.mapper';

@Injectable({
  providedIn: 'root',
})
export class HttpMyEventsService {
  private readonly _bookingsApi = inject(BookingsHttpService);
  private readonly _eventsApi = inject(EventsHttpService);
  private readonly _buildingsApi = inject(BuildingsHttpService);
  private readonly _roomsApi = inject(RoomsHttpService);
  private readonly _floorsApi = inject(FloorsHttpService);

  loadMyEvents$(): Observable<{
    bookings: MyEventsBooking[];
    events: MyEventsEvent[];
    buildings: MyEventsBuilding[];
    rooms: MyEventsRoom[];
    floors: MyEventsFloor[];
  }> {
    return forkJoin({
      bookings: this._bookingsApi.bookingsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToMyEventsBooking))),
      events: this._eventsApi.eventsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToMyEventsEvent))),
      buildings: this._buildingsApi.buildingsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToMyEventsBuilding))),
      rooms: this._roomsApi.roomsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToMyEventsRoom))),
      floors: this._floorsApi.floorsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToMyEventsFloor))),
    });
  }

  deleteBooking$(id: string): Observable<void> {
    return this._bookingsApi.bookingsIdDelete({ id }).pipe(map(() => void 0));
  }
}
