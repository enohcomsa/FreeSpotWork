import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Building } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpBuildingService } from '@http-free-spot/building';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminBuildingService {
  private _httpBuildingService: HttpBuildingService = inject(HttpBuildingService);

  private _buildingListSig: WritableSignal<Building[]> = signal([]);
  buildingListSig = this._buildingListSig.asReadonly();

  init(): void {
    this._httpBuildingService
      .getBuildingList()
      .pipe(take(1))
      .subscribe((buildingList: Building[]) => {
        this._buildingListSig.set(buildingList?.filter((building: Building) => building !== null));
      });
  }

  getBuildingByName(buildingName: string): Signal<Building> {
    return computed(
      () => this.buildingListSig().find((building: Building) => building.name === buildingName) || ({} as Building),
    );
  }

  addBuilding(newBuilding: Building): void {
    SignalArrayUtil.addItem(newBuilding, this._buildingListSig);
    this._httpBuildingService.storeBuildingList(this._buildingListSig());
  }

  updateBuilding(oldBuilding: Building, updatedBuilding: Building): void {
    SignalArrayUtil.replaceItem(oldBuilding, this._buildingListSig, updatedBuilding);
    this._httpBuildingService.storeBuildingList(this._buildingListSig());
  }

  deleteBuilding(deletedBuilding: Building): void {
    SignalArrayUtil.deleteItem(deletedBuilding, this._buildingListSig);
    this._httpBuildingService.storeBuildingList(this._buildingListSig());
  }
}
