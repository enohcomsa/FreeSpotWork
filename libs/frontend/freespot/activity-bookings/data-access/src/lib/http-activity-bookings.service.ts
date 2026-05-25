import { inject, Injectable } from '@angular/core';
import {
  BookingsHttpService,
  type BookingResponseDTO,
  BuildingsHttpService,
  type BuildingResponseDTO,
  FloorsHttpService,
  type FloorResponseDTO,
  RoomsHttpService,
  type RoomResponseDTO,
  SubjectsHttpService,
  type SubjectResponseDTO,
  TimetableActivitiesHttpService,
  type TimetableActivityResponseDTO,
} from '@free-spot/api-client';
import {
  type ActivityBooking,
  type ActivityBookingActivity,
  type ActivityBookingBuilding,
  type ActivityBookingFloor,
  type ActivityBookingRoom,
  type ActivityBookingSubject,
} from '@free-spot/activity-bookings/domain';
import { forkJoin, map, Observable } from 'rxjs';
import {
  bookingDtoToDomain,
  buildingDtoToDomain,
  floorDtoToDomain,
  roomDtoToDomain,
  subjectDtoToDomain,
  timetableActivityDtoToDomain,
} from './activity-bookings.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpActivityBookingsService {
  private readonly _bookingsApi = inject(BookingsHttpService);
  private readonly _subjectsApi = inject(SubjectsHttpService);
  private readonly _timetableActivitiesApi = inject(TimetableActivitiesHttpService);
  private readonly _roomsApi = inject(RoomsHttpService);
  private readonly _buildingsApi = inject(BuildingsHttpService);
  private readonly _floorsApi = inject(FloorsHttpService);

  loadActivityBookingsContext$(): Observable<{
    bookings: ActivityBooking[];
    subjects: ActivityBookingSubject[];
    timetableActivities: ActivityBookingActivity[];
    rooms: ActivityBookingRoom[];
    buildings: ActivityBookingBuilding[];
    floors: ActivityBookingFloor[];
  }> {
    return forkJoin({
      bookings: this.listBookings$(),
      subjects: this.listSubjects$(),
      timetableActivities: this.listTimetableActivities$(),
      rooms: this.listRooms$(),
      buildings: this.listBuildings$(),
      floors: this.listFloors$(),
    });
  }

  private listBookings$(): Observable<ActivityBooking[]> {
    return this._bookingsApi.bookingsGet().pipe(
      map((dtos: BookingResponseDTO[]) => (dtos ?? []).map(bookingDtoToDomain))
    );
  }

  private listSubjects$(): Observable<ActivityBookingSubject[]> {
    return this._subjectsApi.subjectsGet().pipe(
      map((dtos: SubjectResponseDTO[]) => (dtos ?? []).map(subjectDtoToDomain))
    );
  }

  private listTimetableActivities$(): Observable<ActivityBookingActivity[]> {
    return this._timetableActivitiesApi.timetableActivitiesGet().pipe(
      map((dtos: TimetableActivityResponseDTO[]) => (dtos ?? []).map(timetableActivityDtoToDomain))
    );
  }

  private listRooms$(): Observable<ActivityBookingRoom[]> {
    return this._roomsApi.roomsGet().pipe(
      map((dtos: RoomResponseDTO[]) => (dtos ?? []).map(roomDtoToDomain))
    );
  }

  private listBuildings$(): Observable<ActivityBookingBuilding[]> {
    return this._buildingsApi.buildingsGet().pipe(
      map((dtos: BuildingResponseDTO[]) => (dtos ?? []).map(buildingDtoToDomain))
    );
  }

  private listFloors$(): Observable<ActivityBookingFloor[]> {
    return this._floorsApi.floorsGet().pipe(
      map((dtos: FloorResponseDTO[]) => (dtos ?? []).map(floorDtoToDomain))
    );
  }
}
