import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { TimetableItemComponent } from '@free-spot/ui';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';
import { AdminRoomService } from '@free-spot-service/room';
import { SubjectService } from '@free-spot-service/subject';
import { AuthService } from '@free-spot-service/auth';
import { TimetableActivityCardVM } from '@free-spot-presentation/timetable-activity-card';
import { TimetableActivity, WeekDay } from '@free-spot-domain/timetable-activity';

@Component({
  selector: 'free-spot-schedule',
  imports: [TimetableItemComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _timetableActivityService = inject(AdminTimetableActivityService);
  private readonly _roomService = inject(AdminRoomService);
  private readonly _subjectService = inject(SubjectService);

  readonly workWeek: WeekDay[] = [
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
  ];

  readonly activeCohortIdSig = computed(() => {
    const user = this._authService.userSignal$();

    if (!user) return null;

    return user.semigroupCohortId ?? user.groupCohortId ?? null;
  });

  readonly timetableActivityListSig: Signal<TimetableActivity[]> = computed(() => {
    const cohortId = this.activeCohortIdSig();

    if (!cohortId) {
      return [];
    }

    return this._timetableActivityService.selectTimetableActivityListSignalByCohortId(cohortId)();
  });

  private readonly _toCardVM = (timetableActivity: TimetableActivity): TimetableActivityCardVM => ({
    id: timetableActivity.id,
    weekDay: timetableActivity.weekDay,
    startHour: timetableActivity.startHour,
    endHour: timetableActivity.endHour,
    weekParity: timetableActivity.weekParity,
    activityType: timetableActivity.activityType,
    roomName: this._roomService.getSignalById(timetableActivity.roomId)()?.name ?? '',
    subjectItemShortName: this._subjectService.getSignalById(timetableActivity.subjectId)()?.shortName ?? '',
  });

  readonly timetableCardVMListSig = computed(() =>
    this.timetableActivityListSig().map(this._toCardVM)
  );

  readonly timetablePerDay = computed(() => {
    const allTimetableActivities: TimetableActivityCardVM[] = this.timetableCardVMListSig();

    return this.workWeek.map((day: WeekDay) => ({
      day,
      activities: allTimetableActivities.filter(
        (timetableActivity: TimetableActivityCardVM) => timetableActivity.weekDay === day
      ),
    }));
  });

  ngOnInit(): void {
    this._timetableActivityService.init();
    this._roomService.init();
    this._subjectService.init();

    if (!this._authService.initializedSignal$()) {
      this._authService.loadMe().subscribe();
    }
  }
}
