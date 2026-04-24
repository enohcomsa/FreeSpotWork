import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MyActivityBookingsComponent } from '@free-spot/activity-bookings/feature';
import { MyEventsComponent } from '@free-spot/my-events/feature';

@Component({
  selector: 'free-spot-my-bookings',
  imports: [MyActivityBookingsComponent, MyEventsComponent],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookings { }
