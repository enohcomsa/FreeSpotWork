import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of, switchMap, take } from 'rxjs';
import {
  type ActivityRescheduleBookingCmd,
  type ActivityReschedulingActivity,
  type ActivityReschedulingBooking,
  type ActivityReschedulingBuilding,
  type ActivityReschedulingFloor,
  type ActivityReschedulingOptionsResult,
  type ActivityReschedulingRoom,
  type ActivityReschedulingSubject,
  type ReschedulableBookingVm,
  type RescheduleOptionCardVm,
} from '@free-spot/activity-rescheduling/domain';
import { ConfirmModalService } from '@free-spot/shared/ui';
import { ToastrService } from 'ngx-toastr';
import { HttpActivityReschedulingService } from './http-activity-rescheduling.service';

@Injectable({ providedIn: 'root' })
export class ActivityReschedulingStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly toastr = inject(ToastrService);
  private readonly _api = inject(HttpActivityReschedulingService);

  private readonly _subjects = signal<ActivityReschedulingSubject[]>([]);
  private readonly _activities = signal<ActivityReschedulingActivity[]>([]);
  private readonly _rooms = signal<ActivityReschedulingRoom[]>([]);
  private readonly _buildings = signal<ActivityReschedulingBuilding[]>([]);
  private readonly _floors = signal<ActivityReschedulingFloor[]>([]);
  private readonly _rescheduleOptions = signal<ActivityReschedulingOptionsResult | null>(null);
  private readonly _bookings = signal<ActivityReschedulingBooking[]>([]);
  private readonly _selectedBookingId = signal<string | null>(null);

  readonly rescheduleOptions = this._rescheduleOptions.asReadonly();

  readonly reschedulableBookings = computed<ReschedulableBookingVm[]>(() =>
    this._bookings()
      .filter((booking) => booking.activityType !== 'SPECIAL_EVENT')
      // .filter((b) => { //TODO: uncomment after timetable date autoupdate
      //   const activity = this.timetableActivityService.getSignalById(b.activityId)();
      //   if (!activity?.date) return false;

      //   const start = new Date(activity.date);
      //   start.setHours(activity.startHour, 0, 0, 0);

      //   return start.getTime() > Date.now();
      // })
      .map((booking) => {
        const subject = booking.subjectId
          ? this._subjects().find((item) => item.id === booking.subjectId)
          : null;
        const activity = this._activities().find((item) => item.id === booking.activityId);

        const label = [
          booking.activityType,
          subject?.shortName ?? subject?.name,
          activity?.date ? new Date(activity.date).toLocaleDateString() : '',
          activity?.startHour != null && activity?.endHour != null
            ? `${activity.startHour}-${activity.endHour}`
            : '',
        ]
          .filter(Boolean)
          .join(' · ');

        return { id: booking.id, label };
      })
  );

  readonly optionCards = computed<RescheduleOptionCardVm[]>(() => {
    const result = this.rescheduleOptions();

    if (!result) {
      return [];
    }

    return result.items
      .map((item) => {
        const activity = this._activities().find((current) => current.id === item.activityId);

        if (!activity) {
          return null;
        }

        const subject = this._subjects().find((current) => current.id === activity.subjectId);
        const room = this._rooms().find((current) => current.id === activity.roomId);
        const building = this._buildings().find((current) => current.id === room?.buildingId);
        const floor = this._floors().find((current) => current.id === room?.floorId);

        return {
          id: activity.id,
          subjectName: subject?.shortName ?? subject?.name ?? '',
          buildingName: building?.name ?? '',
          floorName: floor?.name ?? '',
          roomName: room?.name ?? '',
          date: activity.date,
          startHour: activity.startHour,
          endHour: activity.endHour,
          freeSpots: item.freeSpots,
        };
      })
      .filter((item): item is RescheduleOptionCardVm => item !== null);
  });

  load(): void {
    this._api
      .loadActivityReschedulingContext$()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ bookings, subjects, activities, rooms, buildings, floors }) => {
        this._bookings.set(bookings);
        this._subjects.set(subjects);
        this._activities.set(activities);
        this._rooms.set(rooms);
        this._buildings.set(buildings);
        this._floors.set(floors);
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

    if (!id) {
      return;
    }

    this._api
      .getRescheduleOptions$(id)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this._rescheduleOptions.set(result);
      });
  }

  clearOptions(): void {
    this._rescheduleOptions.set(null);
  }

  confirmReschedule(activityId: string): Observable<boolean> {
    const bookingId = this._selectedBookingId();

    if (!bookingId) {
      return of(false);
    }

    return this.confirmService
      .openConfirmDialog('Are you sure you want to reschedule this booking? The old booking slot will be lost.')
      .afterClosed()
      .pipe(
        take(1),
        switchMap((result: boolean) => {
          if (!result) {
            return of(false);
          }

          const cmd: ActivityRescheduleBookingCmd = { activityId };

          return this._api.rescheduleBooking$(bookingId, cmd).pipe(
            switchMap(() =>
              this._api.loadActivityReschedulingContext$().pipe(
                take(1),
                switchMap(({ bookings, subjects, activities, rooms, buildings, floors }) => {
                  this._bookings.set(bookings);
                  this._subjects.set(subjects);
                  this._activities.set(activities);
                  this._rooms.set(rooms);
                  this._buildings.set(buildings);
                  this._floors.set(floors);

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
