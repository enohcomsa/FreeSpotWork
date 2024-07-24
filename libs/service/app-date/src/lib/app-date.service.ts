import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { FreeSpotDate } from '@free-spot/models';
import { HttpAppDateService } from '@http-free-spot/app-date';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppDateService {
  private _httpAppDateService: HttpAppDateService = inject(HttpAppDateService);

  private _appDateSig: WritableSignal<FreeSpotDate> = signal({} as FreeSpotDate);
  appDateSig = this._appDateSig.asReadonly();

  init(): void {
    this._httpAppDateService
      .getAppDate()
      .pipe(take(1))
      .subscribe((appDate: FreeSpotDate) => {
        const dateDiff: number = new Date().getTime() - new Date(appDate.date).setDate(appDate.date.getDate() + 7);
        this._appDateSig.set(appDate);
      });
  }
}
