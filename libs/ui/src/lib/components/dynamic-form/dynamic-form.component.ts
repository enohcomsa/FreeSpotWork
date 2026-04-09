import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { BookingItemComponent } from '../booking-item/booking-item.component';
import { Booking } from '@free-spot-domain/booking';
import { TimetableActivity } from '@frontend/freespot/schedule/domain';

import { BookingService, AvailabilityService } from '@free-spot-service/booking';
import { AdminTimetableActivityService } from '@frontend/freespot/schedule/data-access';
import { SubjectService } from '@free-spot-service/subject';
import { FormErrorMessage } from '@free-spot/util';

@Component({
  selector: 'free-spot-dynamic-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    BookingItemComponent,
    TranslateModule,
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _bookingService = inject(BookingService);
  private readonly _availabilityService = inject(AvailabilityService);
  private readonly _adminTimetableActivityService = inject(AdminTimetableActivityService);
  private readonly _subjectService = inject(SubjectService);
  private readonly _formErrorMessage = inject(FormErrorMessage);

  searchForm!: FormGroup;

  searchActiveSig: WritableSignal<boolean> = signal(false);

  bookingListSig = this._bookingService.bookingListSig;
  selectedBookingIdSig = this._bookingService.selectedBookingIdSig;
  selectedBookingSig = this._bookingService.selectedBookingSig;
  loadingSig = this._availabilityService.loadingSig;
  rescheduleOptionsSig = this._availabilityService.rescheduleOptionsSig;

  futureReschedulableBookingListSig: Signal<Booking[]> = computed(() => {
    return this._bookingService.normalBookingListSig().filter((booking: Booking) => {
      const activity = this._adminTimetableActivityService.getSignalById(booking.activityId)();
      if (!activity?.id || !activity?.date) return false;

      const start = new Date(activity.date);
      start.setHours(activity.startHour, 0, 0, 0);

      return start.getTime() > Date.now();
    });
  });

  filteredBookingListSig: Signal<Booking[]> = computed(() => {
    const rawValue = this.searchForm?.controls?.['bookingQuery']?.value;
    const query =
      typeof rawValue === 'string'
        ? rawValue.trim().toLowerCase()
        : this._displayBooking(rawValue as Booking | null).toLowerCase();

    if (!query) {
      return this.futureReschedulableBookingListSig();
    }

    return this.futureReschedulableBookingListSig().filter((booking: Booking) =>
      this._displayBooking(booking).toLowerCase().includes(query)
    );
  });

  timetableActivityListFoundSig: Signal<TimetableActivity[]> = computed(() => {
    const result = this.rescheduleOptionsSig();
    if (!result) return [];

    return result.items
      .map((item) => this._adminTimetableActivityService.getSignalById(item.activityId)())
      .filter((activity: TimetableActivity) => Boolean(activity?.id));
  });

  oldTimetableActivitySig: Signal<TimetableActivity> = computed(() => {
    const booking = this.selectedBookingSig();
    if (!booking) return {} as TimetableActivity;

    return this._adminTimetableActivityService.getSignalById(booking.activityId)();
  });

  constructor() {
    effect(() => {
      const selectedBooking = this.selectedBookingSig();
      if (!this.searchForm) return;

      this.searchForm.patchValue(
        {
          bookingQuery: selectedBooking ? this._displayBooking(selectedBooking) : '',
        },
        { emitEvent: false }
      );
    });
  }

  ngOnInit(): void {
    this._bookingService.init();
    this._adminTimetableActivityService.init();
    this._subjectService.init();

    this.searchForm = this._formBuilder.group({
      bookingQuery: ['', Validators.required],
    });

    this.searchForm.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.searchActiveSig.set(false);
        this._availabilityService.clearRescheduleOptions();

        const rawValue = this.searchForm.controls['bookingQuery'].value;
        if (typeof rawValue === 'string') {
          this._bookingService.clearSelectedBooking();
        }
      });
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  displayBookingLabel(booking: Booking | null): string {
    return this._displayBooking(booking);
  }

  onBookingSelected(event: MatAutocompleteSelectedEvent): void {
    const bookingId = event.option.value as string;
    const booking = this.futureReschedulableBookingListSig().find((item: Booking) => item.id === bookingId) ?? null;

    this._bookingService.selectBooking(bookingId);

    this.searchForm.patchValue(
      {
        bookingQuery: this._displayBooking(booking),
      },
      { emitEvent: false }
    );
  }

  onSubmit(): void {
    const selectedBookingId = this.selectedBookingIdSig();
    if (!selectedBookingId) return;

    this._availabilityService.loadRescheduleOptions(selectedBookingId);
    this.searchActiveSig.set(true);
  }

  onBookingActiveChanged(active: boolean): void {
    this.searchActiveSig.set(active);

    if (!active) {
      this._availabilityService.clearRescheduleOptions();
    }
  }

  private _displayBooking(booking: Booking | null): string {
    if (!booking) return '';

    const subject =
      booking.subjectId ? this._subjectService.getSignalById(booking.subjectId)() : null;

    const activity = this._adminTimetableActivityService.getSignalById(booking.activityId)();

    const subjectLabel = subject?.shortName || subject?.name || 'Unknown subject';
    const activityTypeLabel = booking.activityType;
    const dateLabel = activity?.date ? new Date(activity.date).toLocaleDateString() : '';
    const hourLabel =
      activity?.startHour != null && activity?.endHour != null
        ? `${activity.startHour}-${activity.endHour}`
        : '';

    return [activityTypeLabel, subjectLabel, dateLabel, hourLabel].filter(Boolean).join(' · ');
  }
}
