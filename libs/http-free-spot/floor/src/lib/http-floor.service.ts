import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
// import { Floor} from '@free-spot/models';
import { FloorsHttpService, FloorResponseDTO, FloorIdParamDTO } from '@free-spot/api-client';
import { CreateFloorCmd, dtoToDomain, Floor, toCreateDTO, toUpdateDTO, UpdateFloorCmd } from '@free-spot-domain/floor'
import { FloorLegacy } from '@free-spot/models';

@Injectable({
  providedIn: 'root',
})
export class HttpFloorService {
  private _http: HttpClient = inject(HttpClient);
  private _api = inject(FloorsHttpService);

  /** @deprecated Firebase Realtime DB endpoint. Use listFloors$ / createFloor$ / updateFloor$ / deleteFloor$ instead. */
  storeFloorList(floorList: FloorLegacy[]): void {
    this._http
      .put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/floorList.json/', floorList)
      .subscribe();
  }

  /** @deprecated Firebase Realtime DB endpoint. Use listFloors$() instead. */
  getFloorList(): Observable<FloorLegacy[]> {
    return this._http.get<FloorLegacy[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/floorList.json/');
  }


  listFloors$(): Observable<Floor[]> {
    return this._api.floorsGet().pipe(map((dtos: FloorResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getFloorById$(id: string): Observable<Floor> {
    const params: FloorIdParamDTO = { id };
    return this._api.floorsIdGet(params).pipe(map(dtoToDomain));
  }

  createFloor$(input: CreateFloorCmd): Observable<Floor> {
    return this._api.floorsPost({ floorCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateFloor$(id: string, patch: UpdateFloorCmd): Observable<Floor> {
    return this._api.floorsIdPatch({ id, floorUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteFloor$(id: string): Observable<void> {
    return this._api.floorsIdDelete({ id }).pipe(map(() => void 0));
  }


}
