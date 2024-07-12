import { Injectable, signal, WritableSignal } from '@angular/core';
import { Room } from '@free-spot/models';

@Injectable({
  providedIn: 'root',
})
export class AdminRoomService {
  private _roomListSig: WritableSignal<Room[]> = signal([]);
  roomList = this._roomListSig.asReadonly();
}

// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// // import { AppUser } from '../shared/models/user.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserHttpService {
//   private _http: HttpClient = inject(HttpClient);

//   storeUsers(userList: string[]): void {
//     this._http.put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/userList.json/', userList).subscribe();
//   }
// }
