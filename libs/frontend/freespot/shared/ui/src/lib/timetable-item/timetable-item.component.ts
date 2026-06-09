import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import {
  type TimetableDayItem,
  type TimetableUiActivity,
} from './timetable-item.model';
import { WeekDay, WeekParity } from '@free-spot/shared/domain';

@Component({
  selector: 'free-spot-timetable-item',
  imports: [MatCardModule, MatListModule, MatDividerModule, TranslateModule, NgTemplateOutlet],
  templateUrl: './timetable-item.component.html',
  styleUrl: './timetable-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimetableItemComponent {
  readonly day = input<WeekDay>();
  readonly timetableItemSig = input<TimetableUiActivity[]>();

  private readonly baseDayItems: TimetableDayItem[] = [
    { hourInterval: '08-10', startHour: 8 },
    { hourInterval: '10-12', startHour: 10 },
    { hourInterval: '12-14', startHour: 12 },
    { hourInterval: '14-16', startHour: 14 },
    { hourInterval: '16-18', startHour: 16 },
    { hourInterval: '18-20', startHour: 18 },
  ];

  readonly dayItems = computed<TimetableDayItem[]>(() => {
    const items = this.baseDayItems.map((item) => ({ ...item }));

    for (const activity of this.timetableItemSig() ?? []) {
      const item = items.find((dayItem) => dayItem.startHour === activity.startHour);

      if (!item) {
        continue;
      }

      switch (activity.weekParity) {
        case 'ODD':
          item.oddWeekActivity = activity;
          break;
        case 'EVEN':
          item.evenWeekActivity = activity;
          break;
        case 'BOTH':
          item.bothWeekActivity = activity;
          break;
      }
    }

    return items;
  });

  getActivityTypeInitial(activityType: string): string {
    return activityType[0] ?? '';
  }
}
