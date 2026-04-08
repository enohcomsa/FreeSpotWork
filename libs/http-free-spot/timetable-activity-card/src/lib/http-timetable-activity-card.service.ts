import { inject, Injectable } from '@angular/core';
import { TimetableActivityCardIdParamDTO, TimetableActivityCardResponseDTO, TimetableActivityCardsHttpService } from "@free-spot/api-client";
import { map, Observable } from 'rxjs';
import { TimetableActivityCardVM } from '@free-spot-presentation/timetable-activity-card';
import { toTimetableActivityCardVM } from './mappers/timetable-activity-card.vm.mapper';

@Injectable({
  providedIn: 'root'
})
export class HttpTimetableActivityCardService {
  private _api = inject(TimetableActivityCardsHttpService);

  listTimetableActivityCards$(): Observable<TimetableActivityCardVM[]> {
    return this._api.timetableActivityCardsGet().pipe(map((dtos: TimetableActivityCardResponseDTO[]) => (dtos ?? []).map(toTimetableActivityCardVM)));
  }

  getTimetableActivityById$(id: string): Observable<TimetableActivityCardVM> {
    const params: TimetableActivityCardIdParamDTO = { id };
    return this._api.timetableActivityCardsIdGet(params).pipe(map(toTimetableActivityCardVM));
  }

  listTimetableActivityCardsByRoomId$(roomId: string): Observable<TimetableActivityCardVM[]> {
    const params: TimetableActivityCardIdParamDTO = { id: roomId };
    return this._api.getTimetableActivityCardsByRoomId(params).pipe(map((dtos: TimetableActivityCardResponseDTO[]) => (dtos ?? []).map(toTimetableActivityCardVM)));
  }
}
