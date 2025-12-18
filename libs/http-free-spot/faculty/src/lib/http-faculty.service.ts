import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FacultyLegacy } from '@free-spot/models';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpFacultyService {
  private _http: HttpClient = inject(HttpClient);

  storeFacultyList(facultyList: FacultyLegacy[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/facultyList.json/', facultyList)
      .subscribe();
  }

  getFacultyList(): Observable<FacultyLegacy[]> {
    return this._http.get<FacultyLegacy[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/facultyList.json/');
  }
}
