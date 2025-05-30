import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';

import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { TimetableActivityItem, TimetableDayItem, TimeTableItem } from '@free-spot/models';
import { MatCardModule } from '@angular/material/card';
import { Event, WeekDay, WeekParity } from '@free-spot/enums';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-timetable-item',

  imports: [MatCardModule, MatListModule, MatDividerModule, TranslateModule],
  templateUrl: './timetable-item.component.html',
  styleUrl: './timetable-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimetableItemComponent implements OnInit {
  timetableItemSig = input.required<TimeTableItem>();

  weekDay = WeekDay;
  dayItems: TimetableDayItem[] = [
    { hourInterval: '08-10', startHour: 8 },
    { hourInterval: '10-12', startHour: 10 },
    { hourInterval: '12-14', startHour: 12 },
    { hourInterval: '14-16', startHour: 14 },
    { hourInterval: '16-18', startHour: 16 },
    { hourInterval: '18-20', startHour: 18 },
  ];

  ngOnInit(): void {
    if (this.timetableItemSig().activities) {
      this.timetableItemSig().activities.forEach((activity: TimetableActivityItem) => {
        switch (activity.startHour) {
          case 8:
            this._addActivity(activity, 0);
            break;
          case 10:
            this._addActivity(activity, 1);
            break;
          case 12:
            this._addActivity(activity, 2);
            break;
          case 14:
            this._addActivity(activity, 3);
            break;
          case 16:
            this._addActivity(activity, 4);
            break;
          case 18:
            this._addActivity(activity, 5);
            break;
        }
      });
    }
  }

  getEventInitial(event: Event): string {
    return event[0];
  }

  private _addActivity(activity: TimetableActivityItem, index: number): void {
    if (activity.weekParity === WeekParity.ODD) {
      this.dayItems[index].oddWeekActivity = activity;
    }
    if (activity.weekParity === WeekParity.EVEN) {
      this.dayItems[index].evenWeekActivity = activity;
    }
    if (activity.weekParity === WeekParity.BOTH) {
      this.dayItems[index].bothWeekActivity = activity;
    }
  }
}
