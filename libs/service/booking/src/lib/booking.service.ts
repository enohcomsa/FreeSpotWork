import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Booking, RescheduleBookingCmd } from '@free-spot-domain/booking';
import { HttpBookingService } from '@http-free-spot/booking';
import { SignalArrayUtil } from '@free-spot/util';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly _httpBookingService = inject(HttpBookingService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _bookingListSig: WritableSignal<Booking[]> = signal([]);
  readonly bookingListSig = this._bookingListSig.asReadonly();

  private readonly _loadingSig: WritableSignal<boolean> = signal(false);
  readonly loadingSig = this._loadingSig.asReadonly();

  private readonly _errorSig: WritableSignal<string | null> = signal(null);
  readonly errorSig = this._errorSig.asReadonly();

  setBookingList(items: Booking[]): void {
    this._bookingListSig.set(items);
  }

  getSignalById(id: string): Signal<Booking> {
    return computed(() => this.bookingListSig().find((booking: Booking) => booking.id === id) || ({} as Booking));
  }

  getById(id: string): Observable<Booking> {
    return this._httpBookingService.getBookingById$(id);
  }

  upsertLocal(booking: Booking): void {
    SignalArrayUtil.upsertBy('id', booking, this._bookingListSig);
  }

  removeLocal(id: string): void {
    SignalArrayUtil.removeBy('id', id, this._bookingListSig);
  }

  reschedule(id: string, input: RescheduleBookingCmd): void {
    this._loadingSig.set(true);
    this._errorSig.set(null);

    this._httpBookingService
      .rescheduleBooking$(id, input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (updated: Booking) => {
          SignalArrayUtil.upsertBy('id', updated, this._bookingListSig);
          this._loadingSig.set(false);
        },
        error: (err: unknown) => {
          console.error(err);
          this._errorSig.set('Failed to reschedule booking');
          this._loadingSig.set(false);
        },
      });
  }

  remove(id: string): void {
    this._loadingSig.set(true);
    this._errorSig.set(null);

    this._httpBookingService
      .deleteBooking$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          SignalArrayUtil.removeBy('id', id, this._bookingListSig);
          this._loadingSig.set(false);
        },
        error: (err: unknown) => {
          console.error(err);
          this._errorSig.set('Failed to delete booking');
          this._loadingSig.set(false);
        },
      });
  }
}
