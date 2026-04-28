import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, take, Observable, of } from 'rxjs';
import { RescheduleOptionsResult } from '@free-spot-domain/booking';
import { HttpAvailabilityService } from '@http-free-spot/booking';
import { HttpBookingService } from '@http-free-spot/booking';
import { Booking } from '@free-spot-domain/booking';
import { ActivityType } from '@free-spot/academic-schedule/domain';
import { SubjectService } from '@free-spot-service/subject';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';
import { AdminRoomService } from '@free-spot-service/room';
import { BuildingService } from '@free-spot-service/building';
import { AdminFloorService } from '@free-spot-service/floor';
import { ReschedulableBookingVm } from './reschedulable-booking.model';
import { RescheduleOptionCardVm } from '@free-spot/activity-rescheduling/ui';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { ToastrService } from 'ngx-toastr';



@Injectable({ providedIn: 'root' })
export class ActivityReschedulingStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly toastr = inject(ToastrService);
  private readonly availabilityApi = inject(HttpAvailabilityService);
  private readonly bookingApi = inject(HttpBookingService);

  private readonly subjectService = inject(SubjectService);
  private readonly timetableActivityService = inject(AdminTimetableActivityService);
  private readonly roomService = inject(AdminRoomService);
  private readonly buildingService = inject(BuildingService);
  private readonly floorService = inject(AdminFloorService);

  private readonly _rescheduleOptions = signal<RescheduleOptionsResult | null>(null);
  readonly rescheduleOptions = this._rescheduleOptions.asReadonly();

  private readonly _bookings = signal<Booking[]>([]);
  private readonly _selectedBookingId = signal<string | null>(null);

  readonly reschedulableBookings = computed<ReschedulableBookingVm[]>(() =>
    this._bookings()
      .filter((b) => b.activityType !== ActivityType.SPECIAL_EVENT)
      // .filter((b) => { //TODO: uncomment after timetable date autoupdate
      //   const activity = this.timetableActivityService.getSignalById(b.activityId)();
      //   if (!activity?.date) return false;

      //   const start = new Date(activity.date);
      //   start.setHours(activity.startHour, 0, 0, 0);

      //   return start.getTime() > Date.now();
      // })
      .map((b) => {
        const subject = b.subjectId ? this.subjectService.getSignalById(b.subjectId)() : null;
        const activity = this.timetableActivityService.getSignalById(b.activityId)();

        const label = [
          b.activityType,
          subject?.shortName || subject?.name,
          activity?.date ? new Date(activity.date).toLocaleDateString() : '',
          activity?.startHour != null && activity?.endHour != null
            ? `${activity.startHour}-${activity.endHour}`
            : '',
        ]
          .filter(Boolean)
          .join(' · ');
        return { id: b.id, label };
      })
  );

  readonly optionCards = computed<RescheduleOptionCardVm[]>(() => {
    const result = this.rescheduleOptions();
    if (!result) return [];

    return result.items
      .map((item) => {
        const activity = this.timetableActivityService.getSignalById(item.activityId)();
        if (!activity?.id) return null;

        const subject = activity.subjectId
          ? this.subjectService.getSignalById(activity.subjectId)()
          : null;

        const room = activity.roomId
          ? this.roomService.getSignalById(activity.roomId)()
          : null;

        const building = room?.buildingId
          ? this.buildingService.getSignalById(room.buildingId)()
          : null;

        const floor = room?.floorId
          ? this.floorService.getSignalById(room.floorId)()
          : null;

        return {
          id: activity.id,
          subjectName: subject?.shortName || subject?.name || '',
          buildingName: building?.name || '',
          floorName: floor?.name || '',
          roomName: room?.name || '',
          date: activity.date,
          startHour: activity.startHour,
          endHour: activity.endHour,
          freeSpots: item.freeSpots,
        };
      })
      .filter((x) => x !== null) as RescheduleOptionCardVm[];
  });

  load(): void {
    this.subjectService.init();
    this.timetableActivityService.init();
    this.roomService.init();
    this.buildingService.init();
    this.floorService.init();

    this.bookingApi
      .listBookings$()
      .pipe(take(1))
      .subscribe((bookings: Booking[]) => {
        this._bookings.set(bookings);
      });
  }

  selectBooking(id: string | null): void {
    this._selectedBookingId.set(id);

    if (!id) {
      this._rescheduleOptions.set(null);
    }
  }

  loadOptions(): void {
    const id = this._selectedBookingId();
    if (!id) return;

    this.availabilityApi
      .getRescheduleOptions$(id)
      .pipe(take(1))
      .subscribe((result) => {
        this._rescheduleOptions.set(result);
      });
  }

  clearOptions(): void {
    this._rescheduleOptions.set(null);
  }

  confirmReschedule(activityId: string): Observable<boolean> {
    const bookingId = this._selectedBookingId();
    if (!bookingId) return of(false);

    return this.confirmService
      .openConfirmDialog('Are you sure you want to reschedule this booking? The old booking slot will be lost.')
      .afterClosed()
      .pipe(
        take(1),
        switchMap((result: boolean) => {
          if (!result) {
            return of(false);
          }

          return this.bookingApi.rescheduleBooking$(bookingId, { activityId }).pipe(
            switchMap(() =>
              this.bookingApi.listBookings$().pipe(
                take(1),
                switchMap((bookings) => {
                  this._bookings.set(bookings);
                  this.toastr.success('Booking successfully rescheduled', '', {
                    closeButton: true,
                    progressBar: true,
                    timeOut: 5000,
                    onActivateTick: true,
                    positionClass: 'toast-bottom-center',
                  });
                  this._selectedBookingId.set(null);
                  this._rescheduleOptions.set(null);
                  return of(true);
                })
              )
            )
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      );
  }
}
