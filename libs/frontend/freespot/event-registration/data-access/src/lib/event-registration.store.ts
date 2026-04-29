import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpBookingService } from '@http-free-spot/booking';
import { BookingService } from '@free-spot-service/booking';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { ToastrService } from 'ngx-toastr';
import { of, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventRegistrationStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly toastr = inject(ToastrService);
  private readonly bookingApi = inject(HttpBookingService);
  private readonly bookingService = inject(BookingService);

  register(eventId: string): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to register for this event?')
      .afterClosed()
      .pipe(
        take(1),
        switchMap((result: boolean) => {
          if (!result) {
            return of(null);
          }

          return this.bookingApi.createBooking$({ activityId: eventId }).pipe(take(1));
        }),
        tap((booking) => {
          if (!booking) {
            return;
          }

          this.bookingService.refresh();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((booking) => {
        if (!booking) {
          return;
        }

        this.toastr.success('Successfully registered for event', '', {
          closeButton: true,
          progressBar: true,
          timeOut: 5000,
          onActivateTick: true,
          positionClass: 'toast-bottom-center',
        });
      });
  }
}
