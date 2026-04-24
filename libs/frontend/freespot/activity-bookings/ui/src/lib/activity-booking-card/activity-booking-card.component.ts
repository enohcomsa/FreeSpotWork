import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityBookingCardVm } from '../activity-booking-card.model';

@Component({
  selector: 'free-spot-activity-booking-card',
  imports: [DatePipe, MatCardModule, MatDividerModule, MatIconModule, TranslateModule],
  templateUrl: './activity-booking-card.component.html',
  styleUrl: './activity-booking-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityBookingCardComponent {
  vm = input.required<ActivityBookingCardVm>();
}
