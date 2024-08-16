import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Floor } from '@free-spot/models';

@Injectable({
  providedIn: 'root',
})
export class HttpFloorService {
  private _http: HttpClient = inject(HttpClient);

  storeFloorList(floorList: Floor[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/floorList.json/', floorList)
      .subscribe();
  }

  getFloorList(): Observable<Floor[]> {
    return this._http.get<Floor[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/floorList.json/');
  }
}
