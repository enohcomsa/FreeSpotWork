import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateRoomCmd, Room, UpdateRoomCmd } from '@free-spot-domain/room';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpRoomService } from '@http-free-spot/room';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminRoomService {
  private _httpRoomService: HttpRoomService = inject(HttpRoomService);
  private readonly _destroyRef = inject(DestroyRef);

  private _roomListSig: WritableSignal<Room[]> = signal([]);

  roomListSig = this._roomListSig.asReadonly();


  init(): void {
    if (!this._roomListSig().length) {
      this._httpRoomService
        .listRooms$()
        .pipe(take(1))
        .subscribe((roomList: Room[]) => {
          this._roomListSig.set(roomList);
        });
    }
  }

  selectRoomsByBuildingId(buildingId: string): Signal<Room[]> {
    return computed(() => this.roomListSig().filter((room: Room) => room.buildingId === buildingId));
  }

  selectRoomsByFloorId(floorId: string): Signal<Room[]> {
    return computed(() => this.roomListSig().filter((room: Room) => room.floorId === floorId));
  }

  getSignalById(id: string): Signal<Room> {
    return computed(() => this.roomListSig().find((room: Room) => room.id === id) || ({} as Room))
  }

  getById(id: string): Observable<Room> {
    return this._httpRoomService.getRoomById$(id);
  }

  create(input: CreateRoomCmd): void {
    this._httpRoomService.createRoom$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._roomListSig));
  }

  update(id: string, patch: UpdateRoomCmd): void {
    this._httpRoomService.updateRoom$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._roomListSig));
  }

  remove(id: string): void {
    this._httpRoomService.deleteRoom$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._roomListSig));
  }
}
