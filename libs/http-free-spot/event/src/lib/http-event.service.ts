import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BuildingLegacy } from '@free-spot/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpEventService {
  private _http: HttpClient = inject(HttpClient);

  storeEventList(eventList: BuildingLegacy[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/eventList.json/', eventList)
      .subscribe();
  }

  getEventList(): Observable<BuildingLegacy[]> {
    return this._http.get<BuildingLegacy[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/eventList.json/');
  }
}
