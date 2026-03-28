import { inject, Injectable } from '@angular/core';
import { FacultiesHttpService, FacultyIdParamDTO, FacultyResponseDTO } from '@free-spot/api-client';
import { map, Observable } from 'rxjs';
import { dtoToDomain, toCreateDTO, toUpdateDTO } from '@free-spot-domain/faculty';
import { Faculty, CreateFacultyCmd, UpdateFacultyCmd } from '@free-spot-domain/faculty';

@Injectable({
  providedIn: 'root',
})
export class HttpFacultyService {
  private _api = inject(FacultiesHttpService);

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
