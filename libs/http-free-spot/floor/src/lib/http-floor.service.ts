import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FloorsHttpService, FloorResponseDTO, FloorIdParamDTO } from '@free-spot/api-client';
import { CreateFloorCmd, dtoToDomain, Floor, toCreateDTO, toUpdateDTO, UpdateFloorCmd } from '@free-spot-domain/floor'


@Injectable({
  providedIn: 'root',
})
export class HttpFloorService {
  private _api = inject(FloorsHttpService);

  listFloors$(): Observable<Floor[]> {
    return this._api.floorsGet().pipe(map((dtos: FloorResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getFloorById$(id: string): Observable<Floor> {
    const params: FloorIdParamDTO = { id };
    return this._api.floorsIdGet(params).pipe(map(dtoToDomain));
  }

  createFloor$(input: CreateFloorCmd): Observable<Floor> {
    return this._api.floorsPost({ floorCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateFloor$(id: string, patch: UpdateFloorCmd): Observable<Floor> {
    return this._api.floorsIdPatch({ id, floorUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteFloor$(id: string): Observable<void> {
    return this._api.floorsIdDelete({ id }).pipe(map(() => void 0));
  }
}
