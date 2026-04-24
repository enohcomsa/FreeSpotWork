import { DestroyRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RescheduleOptionsResult } from '@free-spot-domain/booking';
import { HttpAvailabilityService } from '@http-free-spot/booking';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private readonly _httpAvailabilityService = inject(HttpAvailabilityService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _rescheduleOptionsSig: WritableSignal<RescheduleOptionsResult | null> = signal(null);
  readonly rescheduleOptionsSig = this._rescheduleOptionsSig.asReadonly();

  clearRescheduleOptions(): void {
    this._rescheduleOptionsSig.set(null);

  }

  loadRescheduleOptions(bookingId: string): void {
    this._httpAvailabilityService
      .getRescheduleOptions$(bookingId)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe((result: RescheduleOptionsResult) => {
        this._rescheduleOptionsSig.set(result);
      });
  }
}
