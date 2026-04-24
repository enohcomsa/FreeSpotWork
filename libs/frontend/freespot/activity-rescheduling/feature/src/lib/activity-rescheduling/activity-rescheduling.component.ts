import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityReschedulingStore } from '@free-spot/activity-rescheduling/data-access';
import { RescheduleOptionCardComponent } from '@free-spot/activity-rescheduling/ui';

@Component({
  selector: 'free-spot-activity-rescheduling',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatDividerModule,
    RescheduleOptionCardComponent,
  ],
  templateUrl: './activity-rescheduling.component.html',
  styleUrl: './activity-rescheduling.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityReschedulingComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(ActivityReschedulingStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly selectedBookingId = input<string | null>(null);
  readonly rescheduled = output<void>();

  readonly searchActive = signal(false);
  readonly bookingQuery = signal('');

  readonly form = this.fb.group({
    bookingQuery: ['', Validators.required],
  });

  readonly bookingOptions = this.store.reschedulableBookings;
  readonly optionCards = this.store.optionCards;

  readonly filteredBookingOptions = computed(() => {
    const query = this.bookingQuery().trim().toLowerCase();

    if (!query) {
      return this.bookingOptions();
    }

    return this.bookingOptions().filter((item) =>
      item.label.toLowerCase().includes(query)
    );
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedBookingId']) {
      const id = changes['selectedBookingId'].currentValue as string | null;
      if (id) {
        this.applySelectedBooking(id);
      }
    }
  }

  ngOnInit(): void {
    this.store.load();

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const rawValue = this.form.controls.bookingQuery.value;
        this.bookingQuery.set((rawValue ?? '').toString());

        this.searchActive.set(false);
        this.store.clearOptions();

        if (typeof rawValue === 'string') {
          this.store.selectBooking(null);
        }
      });
  }

  displayBookingLabel = (value: string | null): string => {
    if (!value) return '';

    const booking = this.bookingOptions().find((b) => b.id === value);
    return booking?.label ?? value;
  };

  onBookingSelected(event: MatAutocompleteSelectedEvent): void {
    const bookingId = event.option.value as string;
    const booking = this.bookingOptions().find((item) => item.id === bookingId);

    this.store.selectBooking(bookingId);
    this.bookingQuery.set(booking?.label ?? '');

    this.form.patchValue(
      {
        bookingQuery: booking?.label ?? '',
      },
      { emitEvent: false }
    );
  }

  onSubmit(): void {
    this.store.loadOptions();
    this.searchActive.set(true);
  }

  onBook(activityId: string): void {
    this.store
      .confirmReschedule(activityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success) => {
        if (!success) {
          return;
        }

        this.searchActive.set(false);
        this.bookingQuery.set('');
        this.form.patchValue({ bookingQuery: '' });
        this.rescheduled.emit();
      });
  }

  private applySelectedBooking(id: string): void {
    const booking = this.bookingOptions().find((item) => item.id === id);
    if (!booking) return;

    this.store.selectBooking(id);
    this.bookingQuery.set(booking.label);

    this.form.patchValue(
      {
        bookingQuery: booking.label,
      },
      { emitEvent: false }
    );

    this.store.loadOptions();
    this.searchActive.set(true);
  }
}
