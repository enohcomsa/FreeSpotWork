import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateTimetableActivityCmd, TimetableActivity, UpdateTimetableActivityCmd } from '@free-spot-domain/timetable-activity';
import { HttpTimetableActivityService } from '@http-free-spot/timetable-activity';
import { Observable, take } from 'rxjs';
import { SignalArrayUtil } from '@free-spot/util';
import { ActivityType, WeekDay } from '@free-spot/enums';

@Injectable({
  providedIn: 'root'
})
export class AdminTimetableActivityService {
  private _httpTimetableActivityService: HttpTimetableActivityService = inject(HttpTimetableActivityService);
  private readonly _destroyRef = inject(DestroyRef);

  private _timetableActivityListSig: WritableSignal<TimetableActivity[]> = signal([]);
  timetableActivityListSig = this._timetableActivityListSig.asReadonly();


  init(): void {
    if (!this._timetableActivityListSig().length) {
      this._httpTimetableActivityService
        .listTimetableActivityItems$()
        .pipe(take(1))
        .subscribe((timetableActivityList: TimetableActivity[]) => {
          this._timetableActivityListSig.set(timetableActivityList);
        });
    }
  }

  getTimetableActivityListSignalByRoomId(roomId: string): Signal<TimetableActivity[]> {
    return computed(() => this.timetableActivityListSig().filter((timetableActivity: TimetableActivity) => timetableActivity.roomId === roomId));
  }

  selectTimetableActivityListSignalByCohortId(cohortId: string): Signal<TimetableActivity[]> {
    return computed(() => this.timetableActivityListSig().filter((timetableActivity: TimetableActivity) => timetableActivity.cohortIds.includes(cohortId)));
  }

  selectTimetableActivityListSignalBysubjectIdAndWeekDay(subjectId: string, weekDay: WeekDay): Signal<TimetableActivity[]> {
    return computed(() => this.timetableActivityListSig().filter((timetableActivity: TimetableActivity) => timetableActivity.subjectId === subjectId && timetableActivity.weekDay === weekDay && timetableActivity.activityType !== ActivityType.SPECIAL_EVENT));
  }

  addCohortToActivity(cohortId: string, timetableActivityId: string): void {
    const activity: TimetableActivity = this.getSignalById(timetableActivityId)();
    console.log(activity);

    const updatedCohortIds = [...activity.cohortIds, cohortId];

    this.update(timetableActivityId, {
      cohortIds: updatedCohortIds
    })
  }

  removeCohortFromAcitvity(cohortId: string, timetableActivityId: string): void {
    const activity: TimetableActivity = this.getSignalById(timetableActivityId)();

    if (!activity.cohortIds.includes(cohortId)) {
      return;
    }

    const updatedCohortIds = activity.cohortIds.filter(id => id !== cohortId);
    this.update(timetableActivityId, {
      cohortIds: updatedCohortIds
    });
  }

  removeCohortFromAllActivities(cohortId: string): void {
    const activities = this._timetableActivityListSig();

    activities.forEach((activity: TimetableActivity) => {
      if (!activity.cohortIds.includes(cohortId)) {
        return;
      }

      const updatedCohortIds = activity.cohortIds.filter(id => id !== cohortId);
      this.update(activity.id, {
        cohortIds: updatedCohortIds
      });
    });
  }

  getSignalById(id: string): Signal<TimetableActivity> {
    return computed(() => this.timetableActivityListSig().find((timetableActivity: TimetableActivity) => timetableActivity.id === id) || ({} as TimetableActivity));
  }

  getById(id: string): Observable<TimetableActivity> {
    return this._httpTimetableActivityService.getTimetableActivityById$(id);
  }

  create(input: CreateTimetableActivityCmd): void {
    this._httpTimetableActivityService.createTimetableActivityItem$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._timetableActivityListSig));
  }

  update(id: string, patch: UpdateTimetableActivityCmd): void {
    this._httpTimetableActivityService.updateTimetableActivityItem$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._timetableActivityListSig));
  }

  remove(id: string): void {
    this._httpTimetableActivityService.deleteTimetableActivityItem$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._timetableActivityListSig));
  }
}
