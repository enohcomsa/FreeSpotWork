import { inject, Injectable, signal } from '@angular/core';
import {
  type BuildingCardVm,
  type RoomCardVm,
  type UniversityMapFloor,
  type UniversityMapRoom,
} from '@free-spot/university-map/domain';
import { take } from 'rxjs';
import { HttpUniversityMapService } from './http-university-map.service';

@Injectable()
export class UniversityMapStore {
  private readonly _api = inject(HttpUniversityMapService);

  private readonly _buildingCardsSig = signal<BuildingCardVm[]>([]);
  private readonly _roomsSig = signal<UniversityMapRoom[]>([]);
  private readonly _floorsSig = signal<UniversityMapFloor[]>([]);

  readonly buildingCardsSig = this._buildingCardsSig.asReadonly();

  init(): void {
    if (this._buildingCardsSig().length) {
      return;
    }

    this._api
      .loadMap$()
      .pipe(take(1))
      .subscribe(({ buildings, rooms, floors }) => {
        this._buildingCardsSig.set(
          buildings.map((building) => ({
            ...building,
            floors: floors
              .filter((floor) => floor.buildingId === building.id)
              .map((floor) => ({
                name: floor.name,
              })),
          }))
        );

        this._roomsSig.set(rooms);
        this._floorsSig.set(floors);
      });
  }

  getBuildingById(buildingId: string): BuildingCardVm | null {
    return this.buildingCardsSig().find((building) => building.id === buildingId) ?? null;
  }

  getRoomCardVmsByFloorName(floorName: string): RoomCardVm[] {
    const floor = this._floorsSig().find((item) => item.name === floorName);

    if (!floor) {
      return [];
    }

    return this._roomsSig()
      .filter((room) => room.floorId === floor.id)
      .map((room) => ({
        id: room.id,
        name: room.name,
      }));
  }
}
