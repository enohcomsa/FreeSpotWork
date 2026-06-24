import { computed, inject, Injectable, signal } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from '@free-spot/core/data-access';
import {
  type AcademicScheduleRoom,
  type AcademicScheduleSubject,
  type TimetableActivity,
} from '@free-spot/academic-schedule/domain';
import { HttpAcademicScheduleService } from './http-academic-schedule.service';

@Injectable()
export class AcademicScheduleStore {
  private readonly _api = inject(HttpAcademicScheduleService);
  private readonly _authService = inject(AuthService);

  private readonly _activities = signal<TimetableActivity[]>([]);
  private readonly _subjects = signal<AcademicScheduleSubject[]>([]);
  private readonly _rooms = signal<AcademicScheduleRoom[]>([]);

  private readonly activeCohortIdSig = computed<string | null>(() => {
    const user = this._authService.userSignal();

    return user?.semigroupCohortId ?? user?.groupCohortId ?? null;
  });

  readonly subjectListSig = this._subjects.asReadonly();
  readonly roomListSig = this._rooms.asReadonly();

  readonly timetableActivityListSig = computed<TimetableActivity[]>(() => {
    const cohortId = this.activeCohortIdSig();

    if (!cohortId) {
      return [];
    }

    return this._activities().filter((activity) => activity.cohortIds.includes(cohortId));
  });

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
}
