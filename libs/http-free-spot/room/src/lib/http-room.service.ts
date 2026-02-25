import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RoomLegacy } from '@free-spot/models';
import { map, Observable } from 'rxjs';
import { RoomIdParamDTO, RoomResponseDTO, RoomsHttpService } from '@free-spot/api-client';
import { CreateRoomCmd, UpdateRoomCmd, dtoToDomain, toCreateDTO, toUpdateDTO, Room } from '@free-spot-domain/room';

@Injectable({
  providedIn: 'root',
})
export class HttpRoomService {
  private _http: HttpClient = inject(HttpClient);
  private _api = inject(RoomsHttpService);


  /** @deprecated Firebase Realtime DB endpoint. Use listRooms$ / createRoom$ / updateRoom$ / deleteRoom$ instead. */
  storeRoomList(roomList: RoomLegacy[]): void {
    this._http.put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/roomList.json/', roomList).subscribe();
  }

  /** @deprecated Firebase Realtime DB endpoint. Use listRooms$() instead. */
  getRoomList(): Observable<RoomLegacy[]> {
    return this._http.get<RoomLegacy[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/roomList.json/');
  }

  listRooms$(): Observable<Room[]> {
    return this._api.roomsGet().pipe(map((dtos: RoomResponseDTO[]) => (dtos ?? []).map(dtoToDomain)));
  }

  getRoomById$(id: string): Observable<Room> {
    const params: RoomIdParamDTO = { id };
    return this._api.roomsIdGet(params).pipe(map(dtoToDomain));
  }

  createRoom$(input: CreateRoomCmd): Observable<Room> {
    return this._api.roomsPost({ roomCreateDTO: toCreateDTO(input) }).pipe(map(dtoToDomain));
  }

  updateRoom$(id: string, patch: UpdateRoomCmd): Observable<Room> {
    return this._api.roomsIdPatch({ id, roomUpdateDTO: toUpdateDTO(patch) }).pipe(map(dtoToDomain));
  }

  deleteRoom$(id: string): Observable<void> {
    return this._api.roomsIdDelete({ id }).pipe(map(() => void 0));
  }

}
