import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FreeSpotDate } from '@free-spot/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpAppDateService {
  private _http: HttpClient = inject(HttpClient);

  storeAppDate(appDate: FreeSpotDate): void {
    this._http.put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/appDate.json/', appDate).subscribe();
  }

  getAppDate(): Observable<FreeSpotDate> {
    return this._http.get<FreeSpotDate>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/appDate.json/');
  }
}
