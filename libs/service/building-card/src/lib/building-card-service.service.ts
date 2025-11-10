import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { BuildingCardVM } from '@free-spot-presentation/building-card';
import { HttpBuildingCardService } from "@http-free-spot/building-card";
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuildingCardService {
  private _httpBuildingsCardsService: HttpBuildingCardService = inject(HttpBuildingCardService);

  private _buildingCardListSig: WritableSignal<BuildingCardVM[]> = signal<BuildingCardVM[]>([]);
  buildingCardListSig: Signal<BuildingCardVM[]> = this._buildingCardListSig.asReadonly();

  init(): void {
    if (!this._buildingCardListSig().length) {
      this._httpBuildingsCardsService.listBuildingsCards$()
        .pipe(take(1))
        .subscribe((buildingCardList: BuildingCardVM[]) => {
          this._buildingCardListSig.set(buildingCardList);
        });
    }
  }

  getSignalById(id: string): Signal<BuildingCardVM> {
    return computed(() => this.buildingCardListSig().find((building: BuildingCardVM) => building.id === id) || ({} as BuildingCardVM))
  }
}
