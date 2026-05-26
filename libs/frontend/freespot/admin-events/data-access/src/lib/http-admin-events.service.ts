import { inject, Injectable } from '@angular/core';
import {
  BuildingsHttpService,
  EventsHttpService,
  RoomsHttpService,
} from '@free-spot/api-client';
import {
  type AdminEventsBuilding,
  type AdminEventsRoom,
  type AdminSpecialEvent,
  type CreateAdminSpecialEventCmd,
  type UpdateAdminSpecialEventCmd,
} from '@free-spot/admin-events/domain';
import { forkJoin, map, Observable } from 'rxjs';

import {
  adminEventDtoToDomain,
  buildingDtoToDomain,
  createAdminEventCmdToDto,
  roomDtoToDomain,
  updateAdminEventCmdToDto,
} from './admin-events.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpAdminEventsService {
  private readonly eventsApi = inject(EventsHttpService);
  private readonly buildingsApi = inject(BuildingsHttpService);
  private readonly roomsApi = inject(RoomsHttpService);

  load$(): Observable<{
    events: AdminSpecialEvent[];
    buildings: AdminEventsBuilding[];
    rooms: AdminEventsRoom[];
  }> {
    return forkJoin({
      events: this.listEvents$(),
      buildings: this.listBuildings$(),
      rooms: this.listRooms$(),
    });
  }

  createEvent$(cmd: CreateAdminSpecialEventCmd): Observable<AdminSpecialEvent> {
    return this.eventsApi
      .eventsPost({ eventCreateDTO: createAdminEventCmdToDto(cmd) })
      .pipe(map(adminEventDtoToDomain));
  }

  updateEvent$(id: string, cmd: UpdateAdminSpecialEventCmd): Observable<AdminSpecialEvent> {
    return this.eventsApi
      .eventsIdPatch({ id, eventUpdateDTO: updateAdminEventCmdToDto(cmd) })
      .pipe(map(adminEventDtoToDomain));
  }

  deleteEvent$(id: string): Observable<void> {
    return this.eventsApi.eventsIdDelete({ id }).pipe(map(() => void 0));
  }

  private listEvents$(): Observable<AdminSpecialEvent[]> {
    return this.eventsApi.eventsGet().pipe(
      map((dtos) => (dtos ?? []).map(adminEventDtoToDomain))
    );
  }

  private listBuildings$(): Observable<AdminEventsBuilding[]> {
    return this.buildingsApi.buildingsGet().pipe(
      map((dtos) => (dtos ?? []).map(buildingDtoToDomain))
    );
  }

  private listRooms$(): Observable<AdminEventsRoom[]> {
    return this.roomsApi.roomsGet().pipe(
      map((dtos) => (dtos ?? []).map(roomDtoToDomain))
    );
  }
}
