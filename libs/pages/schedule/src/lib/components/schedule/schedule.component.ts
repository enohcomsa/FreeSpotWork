import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { TimetableItemComponent } from '@free-spot/ui';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';
import { WeekDay } from '@free-spot/enums';
import { UserService } from '@free-spot-service/user';
import { TimetableActivityCardVM } from '@free-spot-presentation/timetable-activity-card';

@Component({
  selector: 'free-spot-schedule',
  imports: [TimetableItemComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit {//TODO: impement timetable data from user
  private _userService: UserService = inject(UserService);
  private readonly _timetableActivityService: AdminTimetableActivityService = inject(AdminTimetableActivityService);

  readonly workWeek: WeekDay[] = [
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
  ];

  readonly timetablePerDay = computed(() => {
    const allTimetableActivities: TimetableActivityCardVM[] = [];
    return this.workWeek.map((day: WeekDay) => ({
      day,
      activities: allTimetableActivities.filter((timetableActivity) => timetableActivity.weekDay === day),
    }));
  });


  ngOnInit(): void {
    this._userService.init();
    this._timetableActivityService.init();
  }
}
