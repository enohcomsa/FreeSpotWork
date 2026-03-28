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

  private readonly _loadingSig: WritableSignal<boolean> = signal(false);
  readonly loadingSig = this._loadingSig.asReadonly();

  private readonly _errorSig: WritableSignal<string | null> = signal(null);
  readonly errorSig = this._errorSig.asReadonly();

  clearRescheduleOptions(): void {
    this._rescheduleOptionsSig.set(null);
    this._errorSig.set(null);
    this._loadingSig.set(false);
  }

  loadRescheduleOptions(bookingId: string): void {
    this._loadingSig.set(true);
    this._errorSig.set(null);

    this._httpAvailabilityService
      .getRescheduleOptions$(bookingId)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (result: RescheduleOptionsResult) => {
          this._rescheduleOptionsSig.set(result);
          this._loadingSig.set(false);
        },
        error: (err: unknown) => {
          console.error(err);
          this._errorSig.set('Failed to load reschedule options');
          this._loadingSig.set(false);
        },
      });
  }
}
