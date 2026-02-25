import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventsHttpService } from '@free-spot/api-client';
import { BuildingLegacy } from '@free-spot/models';
import { map, Observable } from 'rxjs';
import { dtoToDomain, toCreateDTO, toUpdateDTO, SpecialEvent, CreateSpecialEventCmd, UpdateSpecialEventCmd } from '@free-spot-domain/event';
import { EventResponseDTO, EventIdParamDTO } from '@free-spot/api-client';

@Injectable({
  providedIn: 'root',
})
export class HttpEventService {
  private _http: HttpClient = inject(HttpClient);
  private _api = inject(EventsHttpService);

  /**
 * @deprecated Firebase-era implementation.
 * Used for storing special events in Realtime Database.
 * Replaced by MongoDB `events` collection + REST API.
 * Do not use for new features. Will be removed after full migration.
 */
  storeEventList(eventList: BuildingLegacy[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/eventList.json/', eventList)
      .subscribe();
  }

  /**
 * @deprecated Firebase-era implementation.
 * Fetches special events from Realtime Database.
 * Replaced by MongoDB `events` collection + REST API.
 * Do not use for new features. Will be removed after full migration.
 */
  getEventList(): Observable<BuildingLegacy[]> {
    return this._http.get<BuildingLegacy[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/eventList.json/');
  }

  listSpecialEvents$(): Observable<SpecialEvent[]> {
    return this._api.eventsGet().pipe(map((dtos: EventResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getSpecialEventById$(id: string): Observable<SpecialEvent> {
    const params: EventIdParamDTO = { id };
    return this._api.eventsIdGet(params).pipe(map(dtoToDomain));
  }

  createSpecialEvent$(input: CreateSpecialEventCmd): Observable<SpecialEvent> {
    return this._api.eventsPost({ eventCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateSpecialEvent$(id: string, patch: UpdateSpecialEventCmd): Observable<SpecialEvent> {
    return this._api.eventsIdPatch({ id, eventUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteSpecialEvent$(id: string): Observable<void> {
    return this._api.eventsIdDelete({ id }).pipe(map(() => void 0));
  }
}
