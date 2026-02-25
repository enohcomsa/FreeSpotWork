import { inject, Injectable } from '@angular/core'
import { CreateProgramCmd, dtoToDomain, Program, toCreateDTO, toUpdateDTO, UpdateProgramCmd } from '@free-spot-domain/program';
import { ProgramIdParamDTO, ProgramResponseDTO, ProgramsHttpService } from '@free-spot/api-client';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpProgramService {
  private _api = inject(ProgramsHttpService);

  listPrograms$(): Observable<Program[]> {
    return this._api.programsGet().pipe(map((dtos: ProgramResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getProgramById$(id: string): Observable<Program> {
    const params: ProgramIdParamDTO = { id };
    return this._api.programsIdGet(params).pipe(map(dtoToDomain));
  }

  createProgram$(input: CreateProgramCmd): Observable<Program> {
    return this._api.programsPost({ programCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateProgram$(id: string, patch: UpdateProgramCmd): Observable<Program> {
    return this._api.programsIdPatch({ id, programUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteProgram$(id: string): Observable<void> {
    return this._api.programsIdDelete({ id }).pipe(map(() => void 0));
  }
}
