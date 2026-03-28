import { inject, Injectable } from '@angular/core';
import { EventsHttpService } from '@free-spot/api-client';
import { map, Observable } from 'rxjs';
import { dtoToDomain, toCreateDTO, toUpdateDTO, SpecialEvent, CreateSpecialEventCmd, UpdateSpecialEventCmd } from '@free-spot-domain/event';
import { EventResponseDTO, EventIdParamDTO } from '@free-spot/api-client';

@Injectable({
  providedIn: 'root',
})
export class HttpEventService {
  private _api = inject(EventsHttpService);

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
