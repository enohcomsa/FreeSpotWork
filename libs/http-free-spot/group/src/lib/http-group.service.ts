import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Group } from '@free-spot/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpGroupService {
  private _http: HttpClient = inject(HttpClient);

  storeGroupList(groupList: Group[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/groupList.json/', groupList)
      .subscribe();
  }

  getGroupList(): Observable<Group[]> {
    return this._http.get<Group[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/groupList.json/');
  }
}
