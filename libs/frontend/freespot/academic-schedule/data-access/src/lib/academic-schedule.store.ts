import { computed, inject, Injectable, signal } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from '@free-spot/core';
import { SubjectService } from '@free-spot-service/subject';
import { AdminRoomService } from '@free-spot-service/room';
import { TimetableActivity, WeekDay } from '@free-spot/academic-schedule/domain';
import { TimetableActivityCardVM } from '@free-spot/academic-schedule/ui';
import { AcademicScheduleTimetableActivityService } from './academic-schedule-timetable-activity.service';

@Injectable()
export class AcademicScheduleStore {
  private readonly _authService = inject(AuthService);
  private readonly _academicScheduleTimetableActivityService = inject(AcademicScheduleTimetableActivityService);
  private readonly _roomService = inject(AdminRoomService);
  private readonly _subjectService = inject(SubjectService);

  private readonly _timetableActivityListSig = signal<TimetableActivity[]>([]);

  readonly workWeek: WeekDay[] = [WeekDay.MONDAY, WeekDay.TUESDAY, WeekDay.WEDNESDAY, WeekDay.THURSDAY, WeekDay.FRIDAY];

  readonly activeCohortIdSig = computed(() => {
    const user = this._authService.userSignal$();

    if (!user) {
      return null;
    }

    return user.semigroupCohortId ?? user.groupCohortId ?? null;
  });

  readonly timetableActivityListSig = computed(() => {
    const cohortId = this.activeCohortIdSig();

    if (!cohortId) {
      return [];
    }

    return this._timetableActivityListSig().filter((activity: TimetableActivity) => activity.cohortIds.includes(cohortId));
  });

  readonly timetableCardVMListSig = computed<TimetableActivityCardVM[]>(() =>
    this.timetableActivityListSig().map((activity: TimetableActivity) => ({
      id: activity.id,
      weekDay: activity.weekDay,
      startHour: activity.startHour,
      endHour: activity.endHour,
      weekParity: activity.weekParity,
      activityType: activity.activityType,
      roomName: this._roomService.getSignalById(activity.roomId)()?.name ?? '',
      subjectItemShortName: this._subjectService.getSignalById(activity.subjectId)()?.shortName ?? '',
    })),
  );

  readonly timetablePerDaySig = computed(() =>
    this.workWeek.map((day: WeekDay) => ({
      day,
      activities: this.timetableCardVMListSig().filter((activity: TimetableActivityCardVM) => activity.weekDay === day),
    })),
  );

  init(): void {
    this._roomService.init();
    this._subjectService.init();

    if (!this._authService.initializedSignal$()) {
      this._authService.loadMe().subscribe();
    }

    if (!this._timetableActivityListSig().length) {
      this._academicScheduleTimetableActivityService
        .list$()
        .pipe(take(1))
        .subscribe((activities: TimetableActivity[]) => {
          this._timetableActivityListSig.set(activities);
        });
    }
  }
}
