import { inject, Injectable } from '@angular/core';
import { BuildingCardIdParamDTO, BuildingsCardResponseDTO, BuildingsCardsHttpService } from "@free-spot/api-client";
import { map, Observable } from 'rxjs';
import { toBuildingCardVM } from '@free-spot-presentation/building-card';

@Injectable({
  providedIn: 'root'
})
export class HttpBuildingCardService {
  private _api = inject(BuildingsCardsHttpService);

  listBuildingsCards$(): Observable<BuildingsCardResponseDTO[]> {
    return this._api.buildingsCardsGet().pipe(map((dtos: BuildingsCardResponseDTO[]) => (dtos ?? []).map(toBuildingCardVM)));
  }

  getBuildingCardById$(id: string): Observable<BuildingsCardResponseDTO> {
    const params: BuildingCardIdParamDTO = { id };
    return this._api.buildingsCardsIdGet(params).pipe(map(toBuildingCardVM));
  }
}
