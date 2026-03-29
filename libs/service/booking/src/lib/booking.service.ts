import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Booking, RescheduleBookingCmd } from '@free-spot-domain/booking';
import { HttpBookingService } from '@http-free-spot/booking';
import { SignalArrayUtil } from '@free-spot/util';
import { ActivityType } from '@free-spot/enums';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly _httpBookingService = inject(HttpBookingService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _bookingListSig: WritableSignal<Booking[]> = signal([]);
  readonly bookingListSig = this._bookingListSig.asReadonly();

  private readonly _selectedBookingIdSig: WritableSignal<string | null> = signal(null);
  readonly selectedBookingIdSig = this._selectedBookingIdSig.asReadonly();

  private readonly _loadingSig: WritableSignal<boolean> = signal(false);
  readonly loadingSig = this._loadingSig.asReadonly();

  private readonly _errorSig: WritableSignal<string | null> = signal(null);
  readonly errorSig = this._errorSig.asReadonly();

  readonly normalBookingListSig = computed(() =>
    this.bookingListSig().filter((booking: Booking) => booking.activityType !== ActivityType.SPECIAL_EVENT)
  );

  readonly specialEventBookingListSig = computed(() =>
    this.bookingListSig().filter((booking: Booking) => booking.activityType === ActivityType.SPECIAL_EVENT)
  );

  readonly selectedBookingSig: Signal<Booking | null> = computed(() => {
    const selectedId = this.selectedBookingIdSig();
    if (!selectedId) return null;
    return this.bookingListSig().find((booking: Booking) => booking.id === selectedId) ?? null;
  });

  init(): void {
    if (!this._bookingListSig().length) {
      this.loadMyBookings();
    }
  }

  loadMyBookings(): void {
    this._loadingSig.set(true);
    this._errorSig.set(null);

    this._httpBookingService
      .listBookings$()
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (bookings: Booking[]) => {
          this._bookingListSig.set(bookings);
          this._loadingSig.set(false);
        },
        error: (err: unknown) => {
          console.error(err);
          this._errorSig.set('Failed to load bookings');
          this._loadingSig.set(false);
        },
      });
  }

  getSignalById(id: string): Signal<Booking | null> {
    return computed(() => this.bookingListSig().find((booking: Booking) => booking.id === id) ?? null);
  }

  getById(id: string): Observable<Booking> {
    return this._httpBookingService.getBookingById$(id);
  }

  selectBooking(id: string | null): void {
    this._selectedBookingIdSig.set(id);
  }

  clearSelectedBooking(): void {
    this._selectedBookingIdSig.set(null);
  }

  setBookingList(items: Booking[]): void {
    this._bookingListSig.set(items);
  }

  upsertLocal(booking: Booking): void {
    SignalArrayUtil.upsertBy('id', booking, this._bookingListSig);
  }

  removeLocal(id: string): void {
    SignalArrayUtil.removeBy('id', id, this._bookingListSig);
  }

  createSpecialEventBooking(activityId: string): void {
    this._loadingSig.set(true);
    this._errorSig.set(null);

    this._httpBookingService
      .createBooking$({ activityId })
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (created: Booking) => {
          SignalArrayUtil.upsertBy('id', created, this._bookingListSig);
          this._loadingSig.set(false);
        },
        error: (err: unknown) => {
          console.error(err);
          this._errorSig.set('Failed to create booking');
          this._loadingSig.set(false);
        },
      });
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

  removeSpecialEventBooking(id: string): void {
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
