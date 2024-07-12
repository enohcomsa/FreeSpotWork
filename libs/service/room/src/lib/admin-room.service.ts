import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Room } from '@free-spot/models';
import { SignalArray } from '@free-spot/util';
import { HttpRoomService } from '@http-free-spot/room';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminRoomService {
  private _httpRoomService: HttpRoomService = inject(HttpRoomService);

  private _roomListSig: WritableSignal<Room[]> = signal([]);
  roomListSig = this._roomListSig.asReadonly();

  init(): void {
    this._httpRoomService
      .getRoomList()
      .pipe(take(1))
      .subscribe((roomList: Room[]) => {
        this._roomListSig.set(roomList);
      });
  }

  getRoomByName(roomName: string): Room {
    return this.roomListSig().find((room: Room) => room.name === roomName) || ({} as Room);
  }

  addRoom(newRoom: Room): void {
    SignalArray.addItem(newRoom, this._roomListSig);
    this._httpRoomService.storeRoomList(this._roomListSig());
  }

  updateRoom(oldRoom: Room, updatedRoom: Room): void {
    SignalArray.replaceItem(oldRoom, this._roomListSig, updatedRoom);
    this._httpRoomService.storeRoomList(this._roomListSig());
  }
}
