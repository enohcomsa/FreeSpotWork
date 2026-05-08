import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin, take } from 'rxjs';
import { AuthService } from '@free-spot/core/data-access';
import {
  type AcademicScheduleRoom,
  type AcademicScheduleSubject,
  type TimetableActivity,
  type TimetableActivityCardVM,
  WeekDay,
} from '@free-spot/academic-schedule/domain';
import { HttpAcademicScheduleService } from './http-academic-schedule.service';

@Injectable()
export class AcademicScheduleStore {
  private readonly _authService = inject(AuthService);
  private readonly _api = inject(HttpAcademicScheduleService);

  private readonly _activities = signal<TimetableActivity[]>([]);
  private readonly _subjects = signal<AcademicScheduleSubject[]>([]);
  private readonly _rooms = signal<AcademicScheduleRoom[]>([]);

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

  readonly timetableActivityListSig = computed(() => {
    const cohortId = this.activeCohortIdSig();
    if (!cohortId) return [];
    return this._activities().filter((activity) => activity.cohortIds.includes(cohortId));
  });

  readonly timetableCardVMListSig = computed<TimetableActivityCardVM[]>(() =>
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
        subjectItemShortName: subject?.shortName || subject?.name || '',
      };
    })
  );

  readonly timetablePerDaySig = computed(() =>
    this.workWeek.map((day) => ({
      day,
      activities: this.timetableCardVMListSig().filter((activity) => activity.weekDay === day),
    }))
  );

  init(): void {
    if (!this._authService.initializedSignal$()) {
      this._authService.loadMe().subscribe();
    }

    forkJoin({
      activities: this._api.listTimetableActivities$(),
      subjects: this._api.listSubjects$(),
      rooms: this._api.listRooms$(),
    })
      .pipe(take(1))
      .subscribe(({ activities, subjects, rooms }) => {
        this._activities.set(activities);
        this._subjects.set(subjects);
        this._rooms.set(rooms);
      });
  }
}
