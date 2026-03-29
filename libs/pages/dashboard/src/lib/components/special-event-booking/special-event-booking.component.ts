import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpecialEvent } from '@free-spot-domain/event';
import { BookingService } from '@free-spot-service/booking';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-special-event-booking',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './special-event-booking.component.html',
  styleUrl: './special-event-booking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialEventBookingComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _bookingService = inject(BookingService);

  readonly specialEventList = input.required<SpecialEvent[]>();
  readonly selectedEventId = input<string | null>(null);

  readonly loadingSig = this._bookingService.loadingSig;

  readonly bookingForm = this._fb.nonNullable.group({
    eventQuery: [''],
  });

  private readonly _selectedEventIdSig: WritableSignal<string | null> = signal(null);

  readonly filteredSpecialEventListSig: Signal<SpecialEvent[]> = computed(() => {
    const query = this.bookingForm.controls.eventQuery.value.trim().toLowerCase();

    if (!query) {
      return this.specialEventList();
    }

    return this.specialEventList().filter((event: SpecialEvent) =>
      this.displayEventLabel(event).toLowerCase().includes(query)
    );
  });

  readonly selectedEventSig: Signal<SpecialEvent | null> = computed(() => {
    const selectedId = this._selectedEventIdSig();
    if (!selectedId) return null;
    return this.specialEventList().find((event: SpecialEvent) => event.id === selectedId) ?? null;
  });

  constructor() {
    effect(() => {
      const externalSelectedId = this.selectedEventId();

      if (!externalSelectedId) return;

      const selectedEvent = this.specialEventList().find(
        (event: SpecialEvent) => event.id === externalSelectedId
      );

      if (!selectedEvent) return;

      this._selectedEventIdSig.set(selectedEvent.id);
      this.bookingForm.patchValue(
        {
          eventQuery: this.displayEventLabel(selectedEvent),
        },
        { emitEvent: false }
      );
    });
  }

  onEventSelected(event: MatAutocompleteSelectedEvent): void {
    const eventId = event.option.value as string;
    const selectedEvent = this.specialEventList().find((item: SpecialEvent) => item.id === eventId) ?? null;

    this._selectedEventIdSig.set(eventId);

    if (selectedEvent) {
      this.bookingForm.patchValue(
        {
          eventQuery: this.displayEventLabel(selectedEvent),
        },
        { emitEvent: false }
      );
    }
  }

  onSubmit(): void {
    const selectedEvent = this.selectedEventSig();
    if (!selectedEvent) return;

    this._bookingService.createSpecialEventBooking(selectedEvent.id);
  }

  displayEventLabel(event: SpecialEvent): string {
    const dateLabel = event.date ? new Date(event.date).toLocaleString() : 'No date';

    return `${event.name} - ${dateLabel}`;
  }
}
