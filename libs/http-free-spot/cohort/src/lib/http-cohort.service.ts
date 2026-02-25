import { inject, Injectable } from '@angular/core';
import { Cohort, CreateCohortCmd, dtoToDomain, toCreateDTO, toUpdateDTO, UpdateCohortCmd } from '@free-spot-domain/cohort';
import { CohortIdParamDTO, CohortResponseDTO, CohortsHttpService } from '@free-spot/api-client';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpCohortService {
  private _api = inject(CohortsHttpService);

  listCohorts$(): Observable<Cohort[]> {
    return this._api.cohortsGet().pipe(map((dtos: CohortResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getCohortById$(id: string): Observable<Cohort> {
    const params: CohortIdParamDTO = { id };
    return this._api.cohortsIdGet(params).pipe(map(dtoToDomain));
  }

  createCohort$(input: CreateCohortCmd): Observable<Cohort> {
    return this._api.cohortsPost({ cohortCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateCohort$(id: string, patch: UpdateCohortCmd): Observable<Cohort> {
    return this._api.cohortsIdPatch({ id, cohortUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteCohort$(id: string): Observable<void> {
    return this._api.cohortsIdDelete({ id }).pipe(map(() => void 0));
  }
}
