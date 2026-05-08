import { inject, Injectable } from '@angular/core';
import {
  BuildingsHttpService,
  EventsHttpService,
  RoomsHttpService,
} from '@free-spot/api-client';
import { forkJoin, map, Observable } from 'rxjs';

import {
  AdminEventsBuilding,
  AdminEventsRoom,
  AdminSpecialEvent,
  CreateAdminSpecialEventCmd,
  UpdateAdminSpecialEventCmd,
} from '@free-spot/admin-events/domain';

import {
  mapAdminEventDtoToDomain,
  mapAdminEventsBuildingDtoToDomain,
  mapAdminEventsRoomDtoToDomain,
  mapCreateAdminEventCmdToDto,
  mapUpdateAdminEventCmdToDto,
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
      events: this.eventsApi.eventsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminEventDtoToDomain)),
      ),
      buildings: this.buildingsApi.buildingsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminEventsBuildingDtoToDomain)),
      ),
      rooms: this.roomsApi.roomsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminEventsRoomDtoToDomain)),
      ),
    });
  }

  createEvent$(cmd: CreateAdminSpecialEventCmd): Observable<AdminSpecialEvent> {
    return this.eventsApi
      .eventsPost({ eventCreateDTO: mapCreateAdminEventCmdToDto(cmd) })
      .pipe(map(mapAdminEventDtoToDomain));
  }

  updateEvent$(
    id: string,
    cmd: UpdateAdminSpecialEventCmd,
  ): Observable<AdminSpecialEvent> {
    return this.eventsApi
      .eventsIdPatch({ id, eventUpdateDTO: mapUpdateAdminEventCmdToDto(cmd) })
      .pipe(map(mapAdminEventDtoToDomain));
  }

  deleteEvent$(id: string): Observable<void> {
    return this.eventsApi.eventsIdDelete({ id }).pipe(map(() => undefined));
  }
}
