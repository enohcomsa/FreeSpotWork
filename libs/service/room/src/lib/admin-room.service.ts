import { Injectable, signal, WritableSignal } from '@angular/core';
import { Room } from '@free-spot/models';

@Injectable({
  providedIn: 'root',
})
export class AdminRoomService {
  private _roomListSig: WritableSignal<Room[]> = signal([]);
  roomList = this._roomListSig.asReadonly();
}
