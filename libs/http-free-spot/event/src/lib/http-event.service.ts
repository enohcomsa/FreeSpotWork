import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Event } from '@free-spot/enums';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpEventService {
  private _http: HttpClient = inject(HttpClient);

  storeEventList(eventList: Event[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/eventList.json/', eventList)
      .subscribe();
  }

  getEventList(): Observable<Event[]> {
    return this._http.get<Event[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/eventList.json/');
  }
}
