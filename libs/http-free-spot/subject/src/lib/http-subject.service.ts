import { inject, Injectable } from '@angular/core';
import { SubjectIdParamDTO, SubjectResponseDTO, SubjectsHttpService } from '@free-spot/api-client';
import { map, Observable } from 'rxjs';
import { CreateSubjectItemCmd, dtoToDomain, SubjectItem, toCreateDTO, toUpdateDTO, UpdateSubjectItemCmd } from '@free-spot-domain/subject';


@Injectable({
  providedIn: 'root'
})
export class HttpSubjectService {
  private _api = inject(SubjectsHttpService);

  listSubjectItems$(): Observable<SubjectItem[]> {
    return this._api.subjectsGet().pipe(map((dtos: SubjectResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getSubjectItemById$(id: string): Observable<SubjectItem> {
    const params: SubjectIdParamDTO = { id };
    return this._api.subjectsIdGet(params).pipe(map(dtoToDomain));
  }

  createSubjectItem$(input: CreateSubjectItemCmd): Observable<SubjectItem> {
    return this._api.subjectsPost({ subjectCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateSubjectItem$(id: string, patch: UpdateSubjectItemCmd): Observable<SubjectItem> {
    return this._api.subjectsIdPatch({ id, subjectUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteSubjectItem$(id: string): Observable<void> {
    return this._api.subjectsIdDelete({ id }).pipe(map(() => void 0));
  }
}
