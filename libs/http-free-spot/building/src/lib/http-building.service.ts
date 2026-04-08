import { inject, Injectable } from '@angular/core';
import { BuildingsHttpService, BuildingResponseDTO, BuildingIdParamDTO } from '@free-spot/api-client';
import { Building, CreateBuildingCmd, UpdateBuildingCmd } from '@free-spot-domain/building';
import { map, Observable } from 'rxjs';
import { dtoToDomain, toCreateDTO, toUpdateDTO } from './mappers/building.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpBuildingService {
  private _api = inject(BuildingsHttpService);

  listBuildings$(): Observable<Building[]> {
    return this._api.buildingsGet().pipe(map((dtos: BuildingResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getBuildingById$(id: string): Observable<Building> {
    const params: BuildingIdParamDTO = { id };
    return this._api.buildingsIdGet(params).pipe(map(dtoToDomain));
  }

  createBuilding$(input: CreateBuildingCmd): Observable<Building> {
    return this._api.buildingsPost({ buildingCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateBuilding$(id: string, patch: UpdateBuildingCmd): Observable<Building> {
    return this._api.buildingsIdPatch({ id, buildingUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteBuilding$(id: string): Observable<void> {
    return this._api.buildingsIdDelete({ id }).pipe(map(() => void 0));
  }
}
