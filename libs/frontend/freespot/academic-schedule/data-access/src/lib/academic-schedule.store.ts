import { computed, inject, Injectable, signal } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from '@free-spot/core/data-access';
import {
  type AcademicScheduleRoom,
  type AcademicScheduleSubject,
  type TimetableActivity,
  type TimetableActivityCardVM,
  type TimetableDayVM,
} from '@free-spot/academic-schedule/domain';
import { HttpAcademicScheduleService } from './http-academic-schedule.service';
import { WeekDay } from '@free-spot/shared/domain';

@Injectable()
export class AcademicScheduleStore {
  private readonly _api = inject(HttpAcademicScheduleService);
  private readonly _authService = inject(AuthService);

  private readonly _activities = signal<TimetableActivity[]>([]);
  private readonly _subjects = signal<AcademicScheduleSubject[]>([]);
  private readonly _rooms = signal<AcademicScheduleRoom[]>([]);

  init(): void {
    this._api
      .loadSchedule$()
      .pipe(take(1))
      .subscribe(({ activities, subjects, rooms }) => {
        this._activities.set(activities);
        this._subjects.set(subjects);
        this._rooms.set(rooms);
      });
  }

  readonly timetablePerDaySig = computed<TimetableDayVM[]>(() =>
    this.workWeek.map((day) => ({
      day,
      activities: this.timetableCardVMListSig().filter((activity) => activity.weekDay === day),
    }))
  );

  private readonly workWeek: WeekDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  private readonly activeCohortIdSig = computed<string | null>(() => {
    const user = this._authService.userSignal();

    return user?.semigroupCohortId ?? user?.groupCohortId ?? null;
  });

  private readonly timetableActivityListSig = computed<TimetableActivity[]>(() => {
    const cohortId = this.activeCohortIdSig();

    if (!cohortId) {
      return [];
    }

    return this._activities().filter((activity) => activity.cohortIds.includes(cohortId));
  });

  private readonly timetableCardVMListSig = computed<TimetableActivityCardVM[]>(() =>
    this.timetableActivityListSig().map((activity) => {
      const room = this._rooms().find((item) => item.id === activity.roomId);
      const subject = this._subjects().find((item) => item.id === activity.subjectId);

      return {
        id: activity.id,
        weekDay: activity.weekDay,
        startHour: activity.startHour,
        endHour: activity.endHour,
        weekParity: activity.weekParity,
        activityType: activity.activityType,
        roomName: room?.name ?? '',
        subjectItemShortName: subject?.shortName ?? subject?.name ?? '',
      };
    })
  );
}
