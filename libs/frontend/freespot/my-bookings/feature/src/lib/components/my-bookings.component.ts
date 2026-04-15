import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'free-spot-my-bookings',
  imports: [],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent {}
