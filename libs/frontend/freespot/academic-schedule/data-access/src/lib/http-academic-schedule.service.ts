import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import {
  RoomsHttpService,
  RoomResponseDTO,
  SubjectsHttpService,
  SubjectResponseDTO,
  TimetableActivitiesHttpService,
  TimetableActivityResponseDTO,
} from '@free-spot/api-client';
import {
  roomDtoToDomain,
  subjectDtoToDomain,
  timetableActivityDtoToDomain,
} from './academic-schedule.dto.mapper';
import {
  type AcademicScheduleRoom,
  type AcademicScheduleSubject,
  type TimetableActivity,
} from '@free-spot/academic-schedule/domain';

@Injectable({ providedIn: 'root' })
export class HttpAcademicScheduleService {
  private readonly _timetableActivitiesApi = inject(TimetableActivitiesHttpService);
  private readonly _subjectsApi = inject(SubjectsHttpService);
  private readonly _roomsApi = inject(RoomsHttpService);

  loadSchedule$(): Observable<{
    activities: TimetableActivity[];
    subjects: AcademicScheduleSubject[];
    rooms: AcademicScheduleRoom[];
  }> {
    return forkJoin({
      activities: this.listTimetableActivities$(),
      subjects: this.listSubjects$(),
      rooms: this.listRooms$(),
    });
  }

  private listTimetableActivities$(): Observable<TimetableActivity[]> {
    return this._timetableActivitiesApi.timetableActivitiesGet().pipe(
      map((dtos: TimetableActivityResponseDTO[]) => (dtos ?? []).map(timetableActivityDtoToDomain))
    );
  }

  private listSubjects$(): Observable<AcademicScheduleSubject[]> {
    return this._subjectsApi.subjectsGet().pipe(
      map((dtos: SubjectResponseDTO[]) => (dtos ?? []).map(subjectDtoToDomain))
    );
  }

  private listRooms$(): Observable<AcademicScheduleRoom[]> {
    return this._roomsApi.roomsGet().pipe(
      map((dtos: RoomResponseDTO[]) => (dtos ?? []).map(roomDtoToDomain))
    );
  }
}
