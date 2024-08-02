import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { WeekDay } from '@free-spot/enums';
import { FreeSpotDate } from '@free-spot/models';
import { HttpAppDateService } from '@http-free-spot/app-date';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppDateService {
  private _httpAppDateService: HttpAppDateService = inject(HttpAppDateService);

  appDateChanged: WritableSignal<boolean> = signal(false);

  private _appDateSig: WritableSignal<FreeSpotDate> = signal({} as FreeSpotDate);
  appDateSig = this._appDateSig.asReadonly();

  init(): void {
    if (!Object.keys(this._appDateSig()).length) {
      this._httpAppDateService
        .getAppDate()
        .pipe(take(1))
        .subscribe((appDate: FreeSpotDate) => {
          const storedAppDate: Date = new Date(appDate.date);
          storedAppDate.setDate(storedAppDate.getDate() + 7);
          const dateDiff: number = new Date().getTime() - storedAppDate.getTime();

          if (dateDiff > 0) {
            const newAppDate: FreeSpotDate = { weekCount: appDate.weekCount, date: new Date() };
            const distance = (1 + newAppDate.date.getDay()) % 7;
            newAppDate.date.setDate(newAppDate.date.getDate() - distance);
            newAppDate.date.setHours(0, 0, 0, 0);
            const weekDiff = Math.floor(
              (newAppDate.date.getTime() - new Date(appDate.date).getTime()) / (1000 * 60 * 60 * 24 * 7),
            );
            newAppDate.weekCount = newAppDate.weekCount + weekDiff;
            this._appDateSig.set(newAppDate);
            this._httpAppDateService.storeAppDate(newAppDate);
            this.appDateChanged.set(true);
          } else {
            this._appDateSig.set({ ...appDate, date: new Date(appDate.date) });
          }
        });
    }
  }

  getAppDateByWeekDay(weekDay: WeekDay): Date {
    const weekDayDate = new Date(this.appDateSig().date);
    let distance = 0;

    switch (weekDay) {
      case WeekDay.MONDAY:
        distance = (6 + weekDayDate.getDay()) % 7;
        weekDayDate.setDate(weekDayDate.getDate() + 7 - distance);
        return weekDayDate;
      case WeekDay.TUESDAY:
        distance = (5 + weekDayDate.getDay()) % 7;
        weekDayDate.setDate(weekDayDate.getDate() + 7 - distance);
        return weekDayDate;
      case WeekDay.WEDNESDAY:
        distance = (4 + weekDayDate.getDay()) % 7;
        weekDayDate.setDate(weekDayDate.getDate() + 7 - distance);
        return weekDayDate;
      case WeekDay.THURSDAY:
        distance = (3 + weekDayDate.getDay()) % 7;
        weekDayDate.setDate(weekDayDate.getDate() + 7 - distance);
        return weekDayDate;
      case WeekDay.FRIDAY:
        distance = (2 + weekDayDate.getDay()) % 7;
        weekDayDate.setDate(weekDayDate.getDate() + 7 - distance);
        return weekDayDate;
      default:
        return weekDayDate;
    }
  }
}
