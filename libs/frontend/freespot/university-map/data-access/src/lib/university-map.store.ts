import { inject, Injectable, signal } from '@angular/core';
import {
  BuildingCard,
  type UniversityMapFloor,
  type UniversityMapRoom,
} from '@free-spot/university-map/domain';
import { take } from 'rxjs';
import { HttpUniversityMapService } from './http-university-map.service';

@Injectable()
export class UniversityMapStore {
  private readonly api = inject(HttpUniversityMapService);

  private readonly buildingCardsSigInternal = signal<BuildingCard[]>([]);
  private readonly roomsSig = signal<UniversityMapRoom[]>([]);
  private readonly floorsSig = signal<UniversityMapFloor[]>([]);

  readonly buildingCardsSig = this.buildingCardsSigInternal.asReadonly();

  init(): void {
    if (this.buildingCardsSigInternal().length) {
      return;
    }

    this.api
      .loadMap$()
      .pipe(take(1))
      .subscribe(({ buildings, rooms, floors }) => {
        this.buildingCardsSigInternal.set(
          buildings.map((building) => ({
            ...building,
            floors: floors
              .filter((floor) => floor.buildingId === building.id)
              .map((floor) => ({
                name: floor.name,
              })),
          })),
        );

        this.roomsSig.set(rooms);
        this.floorsSig.set(floors);
      });
  }

  getBuildingById(buildingId: string): BuildingCard | null {
    return this.buildingCardsSig().find((building) => building.id === buildingId) ?? null;
  }

  getRoomsByFloorName(floorName: string): UniversityMapRoom[] {
    const floor = this.floorsSig().find((item) => item.name === floorName);

    if (!floor) {
      return [];
    }

    return this.roomsSig().filter((room) => room.floorId === floor.id);
  }
}
