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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityReschedulingStore } from '@free-spot/activity-rescheduling/data-access';
import { RescheduleOptionCardComponent, RescheduleOptionCardVm } from '@free-spot/activity-rescheduling/ui';
import { mapToReschedulableBookingVm, mapToRescheduleOptionCardVm } from './activity-rescheduling.vm.mapper';
import { ConfirmModalService } from '@free-spot/shared/ui';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap, take } from 'rxjs';
import { ReschedulableBookingVm } from './reschedulable-booking.vm';

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
  private readonly _store = inject(ActivityReschedulingStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly toastr = inject(ToastrService);

  readonly selectedBookingId = input<string | null>(null);
  readonly rescheduled = output<void>();

  readonly searchActive = signal(false);
  readonly bookingQuery = signal('');
  readonly bookingForm = this.fb.group({
    bookingQuery: [''],
  });
  readonly canSearch = computed(() => {
    return this.autocompleteOptionSelected() && !this.searchActive();
  });

  readonly optionCards = computed<RescheduleOptionCardVm[]>(() => {
    const result = this._store.rescheduleOptions();

    if (!result) {
      return [];
    }

    return result.items
      .map((item) => {
        return mapToRescheduleOptionCardVm(item, this._store.activities(), this._store.subjects(), this._store.rooms(), this._store.buildings(), this._store.floors());
      })
      .filter((item): item is RescheduleOptionCardVm => item !== null);
  });

  readonly filteredBookingOptions = computed(() => {
    const query = this.bookingQuery().trim().toLowerCase();

    if (!query) {
      return this._bookingOptions();
    }

    return this._bookingOptions().filter((item) =>
      item.label.toLowerCase().includes(query)
    );
  });


  private readonly _bookingOptions = computed<ReschedulableBookingVm[]>(() =>
    this._store.bookings()
      .filter((booking) => booking.activityType !== 'SPECIAL_EVENT')
      // .filter((b) => { //TODO: uncomment after timetable date autoupdate
      //   const activity = this.timetableActivityService.getSignalById(b.activityId)();
      //   if (!activity?.date) return false;

      //   const start = new Date(activity.date);
      //   start.setHours(activity.startHour, 0, 0, 0);

      //   return start.getTime() > Date.now();
      // })
      .map((booking) => {
        return mapToReschedulableBookingVm(booking, this._store.subjects(), this._store.activities());
      })
  );
  private readonly autocompleteOptionSelected = signal(false);



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedBookingId']) {
      const id = changes['selectedBookingId'].currentValue as string | null;
      if (id) {
        this.applySelectedBooking(id);
      }
    }
  }

  ngOnInit(): void {
    this._store.load();

    this.bookingForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const rawValue = this.bookingForm.controls.bookingQuery.value;
        this.bookingQuery.set((rawValue ?? '').toString());

        this.searchActive.set(false);
        this._store.clearOptions();

        if (typeof rawValue === 'string') {
          this._store.selectBooking(null);
        }
      });
  }

  displayBookingLabel = (value: string | null): string => {
    if (!value) return '';

    const booking = this._bookingOptions().find((b) => b.id === value);
    return booking?.label ?? value;
  };

  onBookingSelected(event: MatAutocompleteSelectedEvent): void {
    this.autocompleteOptionSelected.set(true);
    const bookingId = event.option.value as string;
    const booking = this._bookingOptions().find((item) => item.id === bookingId);

    this._store.selectBooking(bookingId);
    this.bookingQuery.set(booking?.label ?? '');

    this.bookingForm.patchValue(
      {
        bookingQuery: booking?.label ?? '',
      },
      { emitEvent: false }
    );
  }

  onSubmit(): void {
    this._store.loadOptions();
    this.searchActive.set(true);
  }

  onBook(activityId: string): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to reschedule this booking? The old booking slot will be lost.')
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean),
        switchMap(() => this._store.rescheduleBooking(activityId)),
      )
      .subscribe((success) => {
        if (!success) {
          return;
        }

        this.toastr.success('Booking successfully rescheduled', '', {
          closeButton: true,
          progressBar: true,
          timeOut: 5000,
          onActivateTick: true,
          positionClass: 'toast-bottom-center',
        });

        this.searchActive.set(false);
        this.autocompleteOptionSelected.set(false);
        this.bookingQuery.set('');
        this.bookingForm.patchValue({ bookingQuery: '' });
        this.rescheduled.emit();
      });
  }

  private applySelectedBooking(id: string): void {
    const booking = this._bookingOptions().find((item) => item.id === id);
    if (!booking) return;

    this._store.selectBooking(id);
    this.bookingQuery.set(booking.label);

    this.bookingForm.patchValue(
      {
        bookingQuery: booking.label,
      },
      { emitEvent: false }
    );

    this._store.loadOptions();
    this.searchActive.set(true);
  }
}
