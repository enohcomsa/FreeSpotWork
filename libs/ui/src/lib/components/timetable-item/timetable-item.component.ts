import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { TimetableDayItem } from '@free-spot/academic-schedule/ui';
import { TimetableActivityCardVM, WeekParity, ActivityType, WeekDay } from '@free-spot/academic-schedule/domain';

@Component({
  selector: 'free-spot-timetable-item',
  imports: [MatCardModule, MatListModule, MatDividerModule, TranslateModule],
  templateUrl: './timetable-item.component.html',
  styleUrl: './timetable-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimetableItemComponent {
  day = input<WeekDay>();
  timetableItemSig = input<TimetableActivityCardVM[]>();
  weekDay = WeekDay;

  private readonly baseDayItems: TimetableDayItem[] = [
    { hourInterval: '08-10', startHour: 8 },
    { hourInterval: '10-12', startHour: 10 },
    { hourInterval: '12-14', startHour: 12 },
    { hourInterval: '14-16', startHour: 14 },
    { hourInterval: '16-18', startHour: 16 },
    { hourInterval: '18-20', startHour: 18 },
  ];

  readonly dayItems = computed<TimetableDayItem[]>(() => {
    const activities = this.timetableItemSig() ?? [];
    const items = this.baseDayItems.map(item => ({ ...item }));

    activities.forEach(activity => {
      const index = items.findIndex(d => d.startHour === activity.startHour);
      if (index === -1) return;

      if (activity.weekParity === WeekParity.ODD) {
        items[index].oddWeekActivity = activity;
      }
      if (activity.weekParity === WeekParity.EVEN) {
        items[index].evenWeekActivity = activity;
      }
      if (activity.weekParity === WeekParity.BOTH) {
        items[index].bothWeekActivity = activity;
      }
    });

    return items;
  });

  getActivityTypeInitial(activity: ActivityType): string {
    return activity[0];
  }
}
