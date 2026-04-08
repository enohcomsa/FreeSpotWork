import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProgramYearIdParamDTO, ProgramYearResponseDTO, ProgramYearsHttpService } from '@free-spot/api-client';
import { ProgramYear, CreateProgramYearCmd, UpdateProgramYearCmd } from '@free-spot-domain/program-year';
import { dtoToDomain, toCreateDTO, toUpdateDTO } from './mappers/program-year.dto.mapper';

@Injectable({
  providedIn: 'root'
})
export class HttpProgramYearService {
  private _api = inject(ProgramYearsHttpService);

  listProgramYears$(): Observable<ProgramYear[]> {
    return this._api.programYearsGet().pipe(map((dtos: ProgramYearResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getProgramYearById$(id: string): Observable<ProgramYear> {
    const params: ProgramYearIdParamDTO = { id };
    return this._api.programYearsIdGet(params).pipe(map(dtoToDomain));
  }

  createProgramYear$(input: CreateProgramYearCmd): Observable<ProgramYear> {
    return this._api.programYearsPost({ programYearCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateProgramYear$(id: string, patch: UpdateProgramYearCmd): Observable<ProgramYear> {
    return this._api.programYearsIdPatch({ id, programYearUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteProgramYear$(id: string): Observable<void> {
    return this._api.programYearsIdDelete({ id }).pipe(map(() => void 0));
  }
}
