import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { MyActivityBookingsComponent } from '@free-spot/activity-bookings/feature';
import { MyEventsComponent } from '@free-spot/my-events/feature';
import { ActivityReschedulingComponent } from '@free-spot/activity-rescheduling/feature';

@Component({
  selector: 'free-spot-my-bookings',
  imports: [MyActivityBookingsComponent, ActivityReschedulingComponent, MyEventsComponent],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookings {
  readonly activityBookings = viewChild(MyActivityBookingsComponent);

  readonly selectedBookingId = signal<string | null>(null);

  onBookingSelected(id: string): void {
    this.selectedBookingId.set(id);
  }

  onRescheduled(): void {
    this.selectedBookingId.set(null);
    this.activityBookings()?.refresh();
  }
}
