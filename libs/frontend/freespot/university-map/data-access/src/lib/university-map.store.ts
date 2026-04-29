import { computed, inject, Injectable, signal } from '@angular/core';
import { take } from 'rxjs';
import { HttpBuildingCardService } from '@http-free-spot/building-card';
import { AdminRoomService } from '@free-spot-service/room';
import { AdminFloorService } from '@free-spot-service/floor';
import { BuildingCardVm, RoomCardVm } from '@free-spot/university-map/domain';
import { BuildingCardVM } from '@free-spot-presentation/building-card';

@Injectable()
export class UniversityMapStore {
  private readonly _httpBuildingCardService = inject(HttpBuildingCardService);
  private readonly _roomService = inject(AdminRoomService);
  private readonly _floorService = inject(AdminFloorService);

  private readonly _buildingCardsSig = signal<BuildingCardVm[]>([]);
  readonly buildingCardsSig = this._buildingCardsSig.asReadonly();

  init(): void {
    this._roomService.init();
    this._floorService.init();

    if (this._buildingCardsSig().length) {
      return;
    }

    this._httpBuildingCardService
      .listBuildingsCards$()
      .pipe(take(1))
      .subscribe((buildingCards: BuildingCardVM[]) => {
        this._buildingCardsSig.set(
          buildingCards.map((buildingCard) => ({
            id: buildingCard.id,
            name: buildingCard.name,
            address: buildingCard.address,
            floors: buildingCard.floors.map((floor) => ({
              name: floor.name,
            })),
          }))
        );
      });
  }

  getBuildingById(buildingId: string): BuildingCardVm | null {
    return this.buildingCardsSig().find((building) => building.id === buildingId) ?? null;
  }

  getRoomCardVmsByFloorName(floorName: string): RoomCardVm[] {
    const floor = this._floorService.floorListSig().find((item) => item.name === floorName);

    if (!floor?.id) {
      return [];
    }

    return this._roomService
      .selectRoomsByFloorId(floor.id)()
      .map((room) => ({
        id: room.id,
        name: room.name,
      }));
  }
}
