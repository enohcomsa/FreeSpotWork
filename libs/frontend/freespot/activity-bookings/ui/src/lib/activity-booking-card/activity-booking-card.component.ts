import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityBookingCardVm } from '@free-spot/activity-bookings/domain';

@Component({
  selector: 'free-spot-activity-booking-card',
  imports: [DatePipe, MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, TranslateModule],
  templateUrl: './activity-booking-card.component.html',
  styleUrl: './activity-booking-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityBookingCardComponent {
  vm = input.required<ActivityBookingCardVm>();
  reschedule = output<string>();

  onReschedule(): void {
    this.reschedule.emit(this.vm().id);
  }
}
