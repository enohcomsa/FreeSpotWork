import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityBookingsStore } from '@free-spot/activity-bookings/data-access';
import { ActivityBookingCardComponent } from '@free-spot/activity-bookings/ui';
import { ActivityType } from '@free-spot/academic-schedule/domain';

@Component({
  selector: 'free-spot-my-activity-bookings',
  imports: [MatChipsModule, TranslateModule, ActivityBookingCardComponent],
  templateUrl: './my-activity-bookings.component.html',
  styleUrl: './my-activity-bookings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyActivityBookingsComponent implements OnInit {
  private readonly store = inject(ActivityBookingsStore);

  readonly bookingSelected = output<string>();

  readonly ACTIVITY_TYPE = ActivityType;

  private readonly filter = signal<ActivityType | null>(null);

  readonly bookings = computed(() => {
    const currentFilter = this.filter();
    const items = this.store.bookingCards();

    if (!currentFilter) {
      return items;
    }

    return items.filter((booking) => booking.activityType === currentFilter);
  });

  readonly loading = this.store.loading;
  readonly error = this.store.error;

  ngOnInit(): void {
    this.store.load();
  }

  refresh(): void {
    this.store.refresh();
  }

  setFilter(type: ActivityType | null): void {
    this.filter.set(type);
  }

  selectBooking(id: string): void {

    this.bookingSelected.emit(id);
  }
}
