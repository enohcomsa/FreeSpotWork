import { inject, Injectable } from '@angular/core';
import {
  RoomsHttpService,
  RoomResponseDTO,
  SubjectsHttpService,
  SubjectResponseDTO,
  TimetableActivitiesHttpService,
  TimetableActivityResponseDTO,
} from '@free-spot/api-client';
import {
  type AcademicScheduleRoom,
  type AcademicScheduleSubject,
  type TimetableActivity,
} from '@free-spot/academic-schedule/domain';
import { map, Observable } from 'rxjs';
import {
  roomDtoToDomain,
  subjectDtoToDomain,
  timetableActivityDtoToDomain,
} from './academic-schedule.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpAcademicScheduleService {
  private readonly _timetableActivitiesApi = inject(TimetableActivitiesHttpService);
  private readonly _subjectsApi = inject(SubjectsHttpService);
  private readonly _roomsApi = inject(RoomsHttpService);

  listTimetableActivities$(): Observable<TimetableActivity[]> {
    return this._timetableActivitiesApi.timetableActivitiesGet().pipe(
      map((dtos: TimetableActivityResponseDTO[]) => (dtos ?? []).map(timetableActivityDtoToDomain))
    );
  }

  listSubjects$(): Observable<AcademicScheduleSubject[]> {
    return this._subjectsApi.subjectsGet().pipe(
      map((dtos: SubjectResponseDTO[]) => (dtos ?? []).map(subjectDtoToDomain))
    );
  }

  listRooms$(): Observable<AcademicScheduleRoom[]> {
    return this._roomsApi.roomsGet().pipe(
      map((dtos: RoomResponseDTO[]) => (dtos ?? []).map(roomDtoToDomain))
    );
  }
}
