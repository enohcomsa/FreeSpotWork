import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Event } from '@free-spot/enums';
import { BookingItemComponent } from '../booking-item/booking-item.component';

@Component({
  selector: 'free-spot-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatButtonModule, BookingItemComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _destroyRef = inject(DestroyRef);

  eventNames: string[] = ['event_efeffe', 'event_deww', 'event_eeeee', 'event_ertty', 'event_xzxz'];
  materieNames: string[] = ['materie_efeffe', 'materie_deww', 'materie_eeeee', 'materie_ertty', 'materie_xzxz'];

  EVENT = Event;

  searchActive$: WritableSignal<boolean> = signal(false);

  searchForm = this._formBuilder.group({
    eventBooking: [this.EVENT.LABORATORY],
    subject: [this.materieNames[0]],
    event: [this.eventNames[0]],
  });

  ngOnInit(): void {
    this.searchForm.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => this.searchActive$.set(false));
  }

  get event(): Event {
    return this.searchForm.get('eventBooking')?.value as Event;
  }

  onSubmit(): void {
    console.log(this.searchForm.value);
    this.searchActive$.set(true);
  }
}
