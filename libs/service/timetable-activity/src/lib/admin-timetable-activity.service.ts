import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateTimetableActivityCmd, TimetableActivity, UpdateTimetableActivityCmd } from '@free-spot-domain/timetable-activity';
import { HttpTimetableActivityService } from '@http-free-spot/timetable-activity';
import { Observable, take } from 'rxjs';
import { SignalArrayUtil } from '@free-spot/util';

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
