import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BuildingLegacy } from '@free-spot/models';
import { BuildingsHttpService, BuildingResponseDTO, BuildingIdParamDTO } from '@free-spot/api-client';
import { Building, dtoToDomain, toCreateDTO, toUpdateDTO, CreateBuildingCmd, UpdateBuildingCmd } from '@free-spot-domain/building';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpBuildingService {
  private _http = inject(HttpClient);
  private _api = inject(BuildingsHttpService);

  /** @deprecated Firebase Realtime DB endpoint. Use listBuildings$ / createBuilding$ / updateBuilding$ / deleteBuilding$ instead. */
  storeBuildingList(buildingList: BuildingLegacy[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/buildingList.json/', buildingList)
      .subscribe();
  }

  /** @deprecated Firebase Realtime DB endpoint. Use listBuildings$() instead. */
  getBuildingList(): Observable<BuildingLegacy[]> {
    return this._http.get<BuildingLegacy[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/buildingList.json/');
  }

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
