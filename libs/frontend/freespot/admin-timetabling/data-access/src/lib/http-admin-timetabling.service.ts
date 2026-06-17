import { inject, Injectable } from '@angular/core';
import {
  BookingsHttpService,
  RoomsHttpService,
  SubjectsHttpService,
  TimetableActivitiesHttpService,
  UsersHttpService,
} from '@free-spot/api-client';
import {
  type AdminTimetableActivity,
  type AdminTimetablingBooking,
  type AdminTimetablingRoom,
  type AdminTimetablingSubject,
  type AdminTimetablingUser,
  type UpdateAdminTimetableActivityCmd,
  type UpdateAdminTimetablingUserCmd,
} from '@free-spot/admin-timetabling/domain';
import { forkJoin, map, Observable } from 'rxjs';

import {
  bookingDtoToDomain,
  roomDtoToDomain,
  subjectDtoToDomain,
  timetableActivityDtoToDomain,
  updateTimetableActivityCmdToDto,
  updateUserCmdToDto,
  userDtoToDomain,
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
      activities: this.listActivities$(),
      rooms: this.listRooms$(),
      subjects: this.listSubjects$(),
      users: this.listUsers$(),
      bookings: this.listBookings$(),
    });
  }

  updateActivity$(id: string, cmd: UpdateAdminTimetableActivityCmd): Observable<AdminTimetableActivity> {
    return this.timetableActivitiesApi
      .timetableActivitiesIdPatch({
        id,
        timetableActivityUpdateDTO: updateTimetableActivityCmdToDto(cmd),
      })
      .pipe(map(timetableActivityDtoToDomain));
  }

  updateUser$(id: string, cmd: UpdateAdminTimetablingUserCmd): Observable<AdminTimetablingUser> {
    return this.usersApi
      .usersIdPatch({ id, userUpdateDTO: updateUserCmdToDto(cmd) })
      .pipe(map(userDtoToDomain));
  }

  private listActivities$(): Observable<AdminTimetableActivity[]> {
    return this.timetableActivitiesApi.timetableActivitiesGet().pipe(
      map((dtos) => (dtos ?? []).map(timetableActivityDtoToDomain))
    );
  }

  private listRooms$(): Observable<AdminTimetablingRoom[]> {
    return this.roomsApi.roomsGet().pipe(
      map((dtos) => (dtos ?? []).map(roomDtoToDomain))
    );
  }

  private listSubjects$(): Observable<AdminTimetablingSubject[]> {
    return this.subjectsApi.subjectsGet().pipe(
      map((dtos) => (dtos ?? []).map(subjectDtoToDomain))
    );
  }

  private listUsers$(): Observable<AdminTimetablingUser[]> {
    return this.usersApi.usersGet().pipe(
      map((dtos) => (dtos ?? []).map(userDtoToDomain))
    );
  }

  private listBookings$(): Observable<AdminTimetablingBooking[]> {
    return this.bookingsApi.bookingsGet().pipe(
      map((dtos) => (dtos ?? []).map(bookingDtoToDomain))
    );
  }
}
