import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Room } from '@free-spot/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpRoomService {
  private _http: HttpClient = inject(HttpClient);

  storeRoomList(roomList: Room[]): void {
    this._http.put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/roomList.json/', roomList).subscribe();
  }

  getRoomList(): Observable<Room[]> {
    return this._http.get<Room[]>('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/roomList.json/');
  }
}
