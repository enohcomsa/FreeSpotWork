import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FacultyLegacy } from '@free-spot/models';
import { FacultiesHttpService, FacultyIdParamDTO, FacultyResponseDTO } from '@free-spot/api-client';
import { map, Observable } from 'rxjs';
import { dtoToDomain, toCreateDTO, toUpdateDTO } from '@free-spot-domain/faculty';
import { Faculty, CreateFacultyCmd, UpdateFacultyCmd } from '@free-spot-domain/faculty';

@Injectable({
  providedIn: 'root',
})
export class HttpFacultyService {
  private _http: HttpClient = inject(HttpClient);
  private _api = inject(FacultiesHttpService);


  /** @deprecated Firebase Realtime DB endpoint. Use listFacultys$ / createFaculty$ / updateFaculty$ / deleteFaculty$ instead. */
  storeFacultyList(facultyList: FacultyLegacy[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/facultyList.json/', facultyList)
      .subscribe();
  }

  /** @deprecated Firebase Realtime DB endpoint. Use listFaculties$() instead. */
  getFacultyList(): Observable<FacultyLegacy[]> {
    return this._http.get<FacultyLegacy[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/facultyList.json/');
  }

  listFaculties$(): Observable<Faculty[]> {
    return this._api.facultiesGet().pipe(map((dtos: FacultyResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getFacultyById$(id: string): Observable<Faculty> {
    const params: FacultyIdParamDTO = { id };
    return this._api.facultiesIdGet(params).pipe(map(dtoToDomain));
  }

  createFaculty$(input: CreateFacultyCmd): Observable<Faculty> {
    return this._api.facultiesPost({ facultyCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateFaculty$(id: string, patch: UpdateFacultyCmd): Observable<Faculty> {
    return this._api.facultiesIdPatch({ id, facultyUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteFaculty$(id: string): Observable<void> {
    return this._api.facultiesIdDelete({ id }).pipe(map(() => void 0));
  }
}
