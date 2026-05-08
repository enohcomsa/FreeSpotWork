import { inject, Injectable } from '@angular/core';
import {
  AvailabilityHttpService,
  BookingsHttpService,
  BookingResponseDTO,
  RescheduleOptionsResponseDTO,
  BuildingsHttpService,
  BuildingResponseDTO,
  FloorsHttpService,
  FloorResponseDTO,
  RoomsHttpService,
  RoomResponseDTO,
  SubjectsHttpService,
  SubjectResponseDTO,
  TimetableActivitiesHttpService,
  TimetableActivityResponseDTO,
} from '@free-spot/api-client';
import { map, Observable } from 'rxjs';
import {
  type ActivityReschedulingBooking,
  type ActivityReschedulingOptionsResult,
  type ActivityRescheduleBookingCmd,
  type ActivityReschedulingActivity,
  type ActivityReschedulingBuilding,
  type ActivityReschedulingFloor,
  type ActivityReschedulingRoom,
  type ActivityReschedulingSubject,
} from '@free-spot/activity-rescheduling/domain';
import {
  rescheduleOptionsDtoToDomain,
  bookingDtoToDomain,
  buildingDtoToDomain,
  floorDtoToDomain,
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

  listBookings$(): Observable<ActivityReschedulingBooking[]> {
    return this._bookingsApi.bookingsGet().pipe(
      map((dtos: BookingResponseDTO[]) => (dtos ?? []).map(bookingDtoToDomain))
    );
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

  listSubjects$(): Observable<ActivityReschedulingSubject[]> {
    return this._subjectsApi.subjectsGet().pipe(
      map((dtos: SubjectResponseDTO[]) => (dtos ?? []).map(subjectDtoToDomain))
    );
  }

  listTimetableActivities$(): Observable<ActivityReschedulingActivity[]> {
    return this._timetableActivitiesApi.timetableActivitiesGet().pipe(
      map((dtos: TimetableActivityResponseDTO[]) => (dtos ?? []).map(timetableActivityDtoToDomain))
    );
  }

  listRooms$(): Observable<ActivityReschedulingRoom[]> {
    return this._roomsApi.roomsGet().pipe(
      map((dtos: RoomResponseDTO[]) => (dtos ?? []).map(roomDtoToDomain))
    );
  }

  listBuildings$(): Observable<ActivityReschedulingBuilding[]> {
    return this._buildingsApi.buildingsGet().pipe(
      map((dtos: BuildingResponseDTO[]) => (dtos ?? []).map(buildingDtoToDomain))
    );
  }

  listFloors$(): Observable<ActivityReschedulingFloor[]> {
    return this._floorsApi.floorsGet().pipe(
      map((dtos: FloorResponseDTO[]) => (dtos ?? []).map(floorDtoToDomain))
    );
  }
}
