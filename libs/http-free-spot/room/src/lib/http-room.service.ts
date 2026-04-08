import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RoomIdParamDTO, RoomResponseDTO, RoomsHttpService } from '@free-spot/api-client';
import { Room, CreateRoomCmd, UpdateRoomCmd } from '@free-spot-domain/room';
import { dtoToDomain, toCreateDTO, toUpdateDTO } from './mappers/room.dto.mapper';

@Injectable({
  providedIn: 'root',
})
export class HttpRoomService {
  private _api = inject(RoomsHttpService);

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
