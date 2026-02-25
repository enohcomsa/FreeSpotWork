import { ChangeDetectionStrategy, Component, computed, input, OnInit } from '@angular/core';

import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { TimetableActivityItemLegacy, TimetableDayItemLecagy, TimeTableItemLecagy } from '@free-spot/models';
import { MatCardModule } from '@angular/material/card';
import { ActivityType, Event, WeekDay, WeekParity } from '@free-spot/enums';
import { TranslateModule } from '@ngx-translate/core';
import { TimetableDayItem } from '@free-spot/models';
import { TimetableActivityCardVM } from '@free-spot-presentation/timetable-activity-card';

@Component({
  selector: 'free-spot-timetable-item',
  imports: [MatCardModule, MatListModule, MatDividerModule, TranslateModule],
  templateUrl: './timetable-item.component.html',
  styleUrl: './timetable-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimetableItemComponent implements OnInit {
  day = input<WeekDay>();
  timetableItemSig = input<TimetableActivityCardVM[]>();
  timetableItemSigLegacy = input<TimeTableItemLecagy>();

  weekDay = WeekDay;
  dayItemsLegacy: TimetableDayItemLecagy[] = [
    { hourInterval: '08-10', startHour: 8 },
    { hourInterval: '10-12', startHour: 10 },
    { hourInterval: '12-14', startHour: 12 },
    { hourInterval: '14-16', startHour: 14 },
    { hourInterval: '16-18', startHour: 16 },
    { hourInterval: '18-20', startHour: 18 },
  ];

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

  ngOnInit(): void {
    if (this.timetableItemSigLegacy()?.activities) {
      this.timetableItemSigLegacy()?.activities.forEach((activity: TimetableActivityItemLegacy) => {
        switch (activity.startHour) {
          case 8:
            this._addActivityLegacy(activity, 0);
            break;
          case 10:
            this._addActivityLegacy(activity, 1);
            break;
          case 12:
            this._addActivityLegacy(activity, 2);
            break;
          case 14:
            this._addActivityLegacy(activity, 3);
            break;
          case 16:
            this._addActivityLegacy(activity, 4);
            break;
          case 18:
            this._addActivityLegacy(activity, 5);
            break;
        }
      });
    }
  }

  getEventInitial(event: Event): string {
    return event[0];
  }

  getActivityTypeInitial(activity: ActivityType): string {
    return activity[0];
  }

  private _addActivityLegacy(activity: TimetableActivityItemLegacy, index: number): void {
    if (activity.weekParity === WeekParity.ODD) {
      this.dayItemsLegacy[index].oddWeekActivity = activity;
    }
    if (activity.weekParity === WeekParity.EVEN) {
      this.dayItemsLegacy[index].evenWeekActivity = activity;
    }
    if (activity.weekParity === WeekParity.BOTH) {
      this.dayItemsLegacy[index].bothWeekActivity = activity;
    }
  }
}
