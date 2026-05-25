import { inject, Injectable } from '@angular/core';
import {
  AvailabilityHttpService,
  BookingsHttpService,
  BookingResponseDTO,
  BuildingResponseDTO,
  BuildingsHttpService,
  FloorResponseDTO,
  FloorsHttpService,
  RescheduleOptionsResponseDTO,
  RoomResponseDTO,
  RoomsHttpService,
  SubjectResponseDTO,
  SubjectsHttpService,
  TimetableActivitiesHttpService,
  TimetableActivityResponseDTO,
} from '@free-spot/api-client';
import {
  type ActivityRescheduleBookingCmd,
  type ActivityReschedulingActivity,
  type ActivityReschedulingBooking,
  type ActivityReschedulingBuilding,
  type ActivityReschedulingFloor,
  type ActivityReschedulingOptionsResult,
  type ActivityReschedulingRoom,
  type ActivityReschedulingSubject,
} from '@free-spot/activity-rescheduling/domain';
import { forkJoin, map, Observable } from 'rxjs';
import {
  bookingDtoToDomain,
  buildingDtoToDomain,
  floorDtoToDomain,
  rescheduleOptionsDtoToDomain,
  roomDtoToDomain,
  subjectDtoToDomain,
  timetableActivityDtoToDomain,
} from './activity-rescheduling.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpActivityReschedulingService {
  private readonly _availabilityApi = inject(AvailabilityHttpService);
  private readonly _bookingsApi = inject(BookingsHttpService);
  private readonly _subjectsApi = inject(SubjectsHttpService);
  private readonly _timetableActivitiesApi = inject(TimetableActivitiesHttpService);
  private readonly _roomsApi = inject(RoomsHttpService);
  private readonly _buildingsApi = inject(BuildingsHttpService);
  private readonly _floorsApi = inject(FloorsHttpService);

  loadActivityReschedulingContext$(): Observable<{
    bookings: ActivityReschedulingBooking[];
    activities: ActivityReschedulingActivity[];
    subjects: ActivityReschedulingSubject[];
    rooms: ActivityReschedulingRoom[];
    buildings: ActivityReschedulingBuilding[];
    floors: ActivityReschedulingFloor[];
  }> {
    return forkJoin({
      bookings: this.listBookings$(),
      activities: this.listTimetableActivities$(),
      subjects: this.listSubjects$(),
      rooms: this.listRooms$(),
      buildings: this.listBuildings$(),
      floors: this.listFloors$(),
    });
  }

  getRescheduleOptions$(bookingId: string): Observable<ActivityReschedulingOptionsResult> {
    return this._availabilityApi
      .availabilityRescheduleOptionsGet({ bookingId })
      .pipe(map((dto: RescheduleOptionsResponseDTO) => rescheduleOptionsDtoToDomain(dto)));
  }

  rescheduleBooking$(bookingId: string, cmd: ActivityRescheduleBookingCmd): Observable<void> {
    return this._bookingsApi
      .bookingsIdPatch({
        id: bookingId,
        bookingRescheduleDTO: { activityId: cmd.activityId },
      })
      .pipe(map(() => void 0));
  }

  private listBookings$(): Observable<ActivityReschedulingBooking[]> {
    return this._bookingsApi.bookingsGet().pipe(
      map((dtos: BookingResponseDTO[]) => (dtos ?? []).map(bookingDtoToDomain))
    );
  }

  private listSubjects$(): Observable<ActivityReschedulingSubject[]> {
    return this._subjectsApi.subjectsGet().pipe(
      map((dtos: SubjectResponseDTO[]) => (dtos ?? []).map(subjectDtoToDomain))
    );
  }

  private listTimetableActivities$(): Observable<ActivityReschedulingActivity[]> {
    return this._timetableActivitiesApi.timetableActivitiesGet().pipe(
      map((dtos: TimetableActivityResponseDTO[]) => (dtos ?? []).map(timetableActivityDtoToDomain))
    );
  }

  private listRooms$(): Observable<ActivityReschedulingRoom[]> {
    return this._roomsApi.roomsGet().pipe(
      map((dtos: RoomResponseDTO[]) => (dtos ?? []).map(roomDtoToDomain))
    );
  }

  private listBuildings$(): Observable<ActivityReschedulingBuilding[]> {
    return this._buildingsApi.buildingsGet().pipe(
      map((dtos: BuildingResponseDTO[]) => (dtos ?? []).map(buildingDtoToDomain))
    );
  }

  private listFloors$(): Observable<ActivityReschedulingFloor[]> {
    return this._floorsApi.floorsGet().pipe(
      map((dtos: FloorResponseDTO[]) => (dtos ?? []).map(floorDtoToDomain))
    );
  }
}
