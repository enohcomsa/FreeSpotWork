import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { DynamicFormComponent } from '@free-spot/ui';
import { BookedSpotComponent } from '../booked-spot/booked-spot.component';

@Component({
  selector: 'free-spot-my-bookings',
  standalone: true,
  imports: [CommonModule, MatChipsModule, DynamicFormComponent, BookedSpotComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent {}
