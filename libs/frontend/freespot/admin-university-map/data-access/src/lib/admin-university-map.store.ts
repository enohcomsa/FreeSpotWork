import { Injectable, Signal, inject } from '@angular/core';
import { Building, CreateBuildingCmd, UpdateBuildingCmd } from '@free-spot-domain/building';
import { BuildingCardVM } from '@free-spot-presentation/building-card';

import { BuildingService } from '@free-spot-service/building';
import { BuildingCardService } from '@free-spot-service/building-card';

@Injectable({ providedIn: 'root' })
export class AdminUniversityMapStore {
  private _buildingService = inject(BuildingService);
  private _buildingCardService = inject(BuildingCardService);

  readonly buildingListSig: Signal<Building[]> = this._buildingService.buildingListSig;
  readonly buildingCardVMs: Signal<BuildingCardVM[]> = this._buildingCardService.buildingCardListSig;

  init() {
    this._buildingService.init();
    this._buildingCardService.init();
  }

  create(cmd: CreateBuildingCmd) {
    this._buildingService.create(cmd);
  }

  update(id: string, cmd: UpdateBuildingCmd) {
    this._buildingService.update(id, cmd);
  }

  remove(id: string) {
    this._buildingService.remove(id);
  }
}
