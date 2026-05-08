import { inject, Injectable } from '@angular/core';
import {
  BookingsHttpService,
  RoomsHttpService,
  SubjectsHttpService,
  TimetableActivitiesHttpService,
  UsersHttpService,
} from '@free-spot/api-client';
import { forkJoin, map, Observable } from 'rxjs';

import {
  AdminTimetableActivity,
  AdminTimetablingBooking,
  AdminTimetablingRoom,
  AdminTimetablingSubject,
  AdminTimetablingUser,
  UpdateAdminTimetableActivityCmd,
  UpdateAdminTimetablingUserCmd,
} from '@free-spot/admin-timetabling/domain';

import {
  mapAdminTimetableActivityDtoToDomain,
  mapAdminTimetablingBookingDtoToDomain,
  mapAdminTimetablingRoomDtoToDomain,
  mapAdminTimetablingSubjectDtoToDomain,
  mapAdminTimetablingUserDtoToDomain,
  mapUpdateAdminTimetableActivityCmdToDto,
  mapUpdateAdminTimetablingUserCmdToDto,
} from './admin-timetabling.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpAdminTimetablingService {
  private readonly timetableActivitiesApi = inject(TimetableActivitiesHttpService);
  private readonly roomsApi = inject(RoomsHttpService);
  private readonly subjectsApi = inject(SubjectsHttpService);
  private readonly usersApi = inject(UsersHttpService);
  private readonly bookingsApi = inject(BookingsHttpService);

  load$(): Observable<{
    activities: AdminTimetableActivity[];
    rooms: AdminTimetablingRoom[];
    subjects: AdminTimetablingSubject[];
    users: AdminTimetablingUser[];
    bookings: AdminTimetablingBooking[];
  }> {
    return forkJoin({
      activities: this.timetableActivitiesApi
        .timetableActivitiesGet()
        .pipe(map((dtos) => (dtos ?? []).map(mapAdminTimetableActivityDtoToDomain))),
      rooms: this.roomsApi.roomsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminTimetablingRoomDtoToDomain)),
      ),
      subjects: this.subjectsApi.subjectsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminTimetablingSubjectDtoToDomain)),
      ),
      users: this.usersApi.usersGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminTimetablingUserDtoToDomain)),
      ),
      bookings: this.bookingsApi.bookingsGet().pipe(
        map((dtos) => (dtos ?? []).map(mapAdminTimetablingBookingDtoToDomain)),
      ),
    });
  }

  updateActivity$(
    id: string,
    cmd: UpdateAdminTimetableActivityCmd,
  ): Observable<AdminTimetableActivity> {
    return this.timetableActivitiesApi
      .timetableActivitiesIdPatch({
        id,
        timetableActivityUpdateDTO: mapUpdateAdminTimetableActivityCmdToDto(cmd),
      })
      .pipe(map(mapAdminTimetableActivityDtoToDomain));
  }

  updateUser$(id: string, cmd: UpdateAdminTimetablingUserCmd): Observable<AdminTimetablingUser> {
    return this.usersApi
      .usersIdPatch({ id, userUpdateDTO: mapUpdateAdminTimetablingUserCmdToDto(cmd) })
      .pipe(map(mapAdminTimetablingUserDtoToDomain));
  }
}
