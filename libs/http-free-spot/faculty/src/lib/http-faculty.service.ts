import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Faculty } from '@free-spot/models';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpFacultyService {
  private _http: HttpClient = inject(HttpClient);

  storeFacultyList(facultyList: Faculty[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/facultyList.json/', facultyList)
      .subscribe();
  }

  getFacultyList(): Observable<Faculty[]> {
    return this._http.get<Faculty[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/facultyList.json/');
  }
}
