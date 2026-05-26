import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmModalService } from '@free-spot/core/ui';
import { ToastrService } from 'ngx-toastr';
import { of, switchMap, take } from 'rxjs';
import { HttpEventRegistrationService } from './http-event-registration.service';

@Injectable({ providedIn: 'root' })
export class EventRegistrationStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly toastr = inject(ToastrService);
  private readonly api = inject(HttpEventRegistrationService);

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

          return this.api.createBooking$(eventId).pipe(take(1));
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
