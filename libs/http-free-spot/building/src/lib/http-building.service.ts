import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Building } from '@free-spot/models';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpBuildingService {
  private _http: HttpClient = inject(HttpClient);

  storeBuildingList(buildingList: Building[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/buildingList.json/', buildingList)
      .subscribe();
  }

  getBuildingList(): Observable<Building[]> {
    return this._http.get<Building[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/buildingList.json/');
  }
}
