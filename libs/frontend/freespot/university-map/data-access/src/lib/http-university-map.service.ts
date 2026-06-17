import { inject, Injectable } from '@angular/core';
import {
  BuildingsHttpService,
  FloorsHttpService,
  RoomsHttpService,
} from '@free-spot/api-client';
import {
  type UniversityMapFloor,
  type UniversityMapRoom,
  type BuildingCard
} from '@free-spot/university-map/domain';
import { forkJoin, map, Observable } from 'rxjs';
import {
  buildingDtoToVm,
  floorDtoToDomain,
  roomDtoToDomain,
} from './university-map.dto.mapper';

@Injectable({ providedIn: 'root' })
export class HttpUniversityMapService {
  private readonly buildingsApi = inject(BuildingsHttpService);
  private readonly floorsApi = inject(FloorsHttpService);
  private readonly roomsApi = inject(RoomsHttpService);

  loadMap$(): Observable<{
    buildings: BuildingCard[];
    rooms: UniversityMapRoom[];
    floors: UniversityMapFloor[];
  }> {
    return forkJoin({
      buildings: this.listBuildings$(),
      rooms: this.listRooms$(),
      floors: this.listFloors$(),
    });
  }

  private listBuildings$(): Observable<BuildingCard[]> {
    return this.buildingsApi.buildingsGet().pipe(map((dtos) => (dtos ?? []).map(buildingDtoToVm)));
  }

  private listRooms$(): Observable<UniversityMapRoom[]> {
    return this.roomsApi.roomsGet().pipe(map((dtos) => (dtos ?? []).map(roomDtoToDomain)));
  }

  private listFloors$(): Observable<UniversityMapFloor[]> {
    return this.floorsApi.floorsGet().pipe(map((dtos) => (dtos ?? []).map(floorDtoToDomain)));
  }
}
