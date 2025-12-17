import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { TimetableActivityCardVM } from '@free-spot-presentation/timetable-activity-card';
import { HttpTimetableActivityCardService } from "@http-free-spot/timetable-activity-card";
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableActivityCardService {
  private _httpTimetableActivityCardsService: HttpTimetableActivityCardService = inject(HttpTimetableActivityCardService);

  private _timetableActivityCardListSig: WritableSignal<TimetableActivityCardVM[]> = signal<TimetableActivityCardVM[]>([]);
  timetableActivityCardListSig: Signal<TimetableActivityCardVM[]> = this._timetableActivityCardListSig.asReadonly();

  init(): void {
    if (!this._timetableActivityCardListSig().length) {
      this._httpTimetableActivityCardsService.listTimetableActivityCards$()
        .pipe(take(1))
        .subscribe((timetableActivityCardList: TimetableActivityCardVM[]) => {
          this._timetableActivityCardListSig.set(timetableActivityCardList);
        });
    }
  }

  getSignalById(id: string): Signal<TimetableActivityCardVM> {
    return computed(() => this.timetableActivityCardListSig().find((timetableActivity: TimetableActivityCardVM) => timetableActivity.id === id) || ({} as TimetableActivityCardVM))
  }

  listTimetableActivityCardsByRoomId$(roomId: string): Observable<TimetableActivityCardVM[]> {
    return this._httpTimetableActivityCardsService.listTimetableActivityCardsByRoomId$(roomId);
  }
}
