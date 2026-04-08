import { inject, Injectable } from '@angular/core';
import { BuildingCardVM } from '@free-spot-presentation/building-card';
import { BuildingCardIdParamDTO, BuildingsCardResponseDTO, BuildingsCardsHttpService } from "@free-spot/api-client";
import { map, Observable } from 'rxjs';
import { toBuildingCardVM } from './mappers/building-card.vm.mapper';

@Injectable({
  providedIn: 'root'
})
export class HttpBuildingCardService {
  private _api = inject(BuildingsCardsHttpService);

  listBuildingsCards$(): Observable<BuildingCardVM[]> {
    return this._api.buildingsCardsGet().pipe(map((dtos: BuildingsCardResponseDTO[]) => (dtos ?? []).map(toBuildingCardVM)));
  }

  getBuildingCardById$(id: string): Observable<BuildingCardVM> {
    const params: BuildingCardIdParamDTO = { id };
    return this._api.buildingsCardsIdGet(params).pipe(map(toBuildingCardVM));
  }
}
