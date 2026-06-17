import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityBookingsStore } from '@free-spot/activity-bookings/data-access';
import { ActivityBookingCardComponent, ActivityBookingCardVm } from '@free-spot/activity-bookings/ui';
import { type ActivityType } from '@free-spot/shared/domain';
import { mapToActivityBookingVm } from './activity-booking.vm.mapper';
@Component({
  selector: 'free-spot-my-activity-bookings',
  imports: [MatChipsModule, TranslateModule, ActivityBookingCardComponent],
  templateUrl: './my-activity-bookings.component.html',
  styleUrl: './my-activity-bookings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyActivityBookingsComponent implements OnInit {
  private readonly _store = inject(ActivityBookingsStore);

  readonly bookingSelected = output<string>();

  readonly activityTypes: ActivityType[] = ['LABORATORY', 'COURSE', 'PROJECT', 'SEMINAR'];

  private readonly _filter = signal<ActivityType | null>(null);

  readonly bookings = computed<ActivityBookingCardVm[]>(() => {
    const currentFilter = this._filter();
    const items = this.bookingCards();

    if (!currentFilter) {
      return items;
    }

    return items.filter((booking) => booking.activityType === currentFilter);
  });

  readonly bookingCards = computed<ActivityBookingCardVm[]>(() =>
    this._store.bookings()
      .map((booking) => {
        const activity = this._store.activities().find((item) => item.id === booking.activityId);

        if (!activity) {
          return null;
        }

        const subject = this._store.subjects().find((item) => item.id === activity.subjectId);
        const room = this._store.rooms().find((item) => item.id === activity.roomId);
        const building = this._store.buildings().find((item) => item.id === room?.buildingId);
        const floor = this._store.floors().find((item) => item.id === room?.floorId);

        if (!subject || !room || !building || !floor) {
          return null;
        }

        return mapToActivityBookingVm(booking, activity, subject, room, building, floor);
      })
      .filter((item): item is ActivityBookingCardVm => item !== null)
  );

  ngOnInit(): void {
    this._store.load();
  }

  refresh(): void {
    this._store.refresh();
  }

  setFilter(type: ActivityType | null): void {
    this._filter.set(type);
  }

  selectBooking(id: string): void {
    this.bookingSelected.emit(id);
  }
}
