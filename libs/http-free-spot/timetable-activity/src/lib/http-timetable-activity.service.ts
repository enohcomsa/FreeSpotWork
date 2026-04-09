import { inject, Injectable } from '@angular/core';
import { TimetableActivitiesHttpService, TimetableActivityIdParamDTO, TimetableActivityResponseDTO } from "@free-spot/api-client";
import { map, Observable } from 'rxjs';
import { CreateTimetableActivityCmd, TimetableActivity, UpdateTimetableActivityCmd } from "@frontend/freespot/schedule/domain";
import { dtoToDomain, toCreateDTO, toUpdateDTO } from './mappers/timetable-activity.dto.mapper';

@Injectable({
  providedIn: 'root'
})
export class HttpTimetableActivityService {
  private _api = inject(TimetableActivitiesHttpService);

  listTimetableActivityItems$(): Observable<TimetableActivity[]> {
    return this._api.timetableActivitiesGet().pipe(map((dtos: TimetableActivityResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getTimetableActivityById$(id: string): Observable<TimetableActivity> {
    const params: TimetableActivityIdParamDTO = { id };
    return this._api.timetableActivitiesIdGet(params).pipe(map(dtoToDomain));
  }

  createTimetableActivityItem$(input: CreateTimetableActivityCmd): Observable<TimetableActivity> {
    return this._api.timetableActivitiesPost({ timetableActivityCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateTimetableActivityItem$(id: string, patch: UpdateTimetableActivityCmd): Observable<TimetableActivity> {
    return this._api.timetableActivitiesIdPatch({ id, timetableActivityUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteTimetableActivityItem$(id: string): Observable<void> {
    return this._api.timetableActivitiesIdDelete({ id }).pipe(map(() => void 0));
  }
}



