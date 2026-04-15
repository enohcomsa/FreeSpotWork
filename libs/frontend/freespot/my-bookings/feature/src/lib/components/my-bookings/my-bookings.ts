import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'freespot-my-bookings',
  imports: [],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookings {}
