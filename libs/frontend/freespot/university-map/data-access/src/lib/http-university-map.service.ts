import { inject, Injectable } from '@angular/core';
import {
  BuildingsHttpService,
  FloorsHttpService,
  RoomsHttpService,
} from '@free-spot/api-client';
import {
  type BuildingCardVm,
  type UniversityMapFloor,
  type UniversityMapRoom,
} from '@free-spot/university-map/domain';
import { forkJoin, map, Observable } from 'rxjs';
import {
  dtoToBuildingCardVm,
  dtoToUniversityMapFloor,
  dtoToUniversityMapRoom,
} from './university-map.dto.mapper';

@Injectable({
  providedIn: 'root',
})
export class HttpUniversityMapService {
  private readonly _buildingsApi = inject(BuildingsHttpService);
  private readonly _floorsApi = inject(FloorsHttpService);
  private readonly _roomsApi = inject(RoomsHttpService);

  loadMap$(): Observable<{
    buildings: BuildingCardVm[];
    rooms: UniversityMapRoom[];
    floors: UniversityMapFloor[];
  }> {
    return forkJoin({
      buildings: this._buildingsApi.buildingsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToBuildingCardVm))),
      rooms: this._roomsApi.roomsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToUniversityMapRoom))),
      floors: this._floorsApi.floorsGet().pipe(map((dtos) => (dtos ?? []).map(dtoToUniversityMapFloor))),
    });
  }
}
