import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Floor } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpFloorService } from '@http-free-spot/floor';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminFloorService {
  private _httpFloorService: HttpFloorService = inject(HttpFloorService);

  private _floorListSig: WritableSignal<Floor[]> = signal([]);
  floorListSig = this._floorListSig.asReadonly();

  init(): void {
    this._httpFloorService
      .getFloorList()
      .pipe(take(1))
      .subscribe((floorList: Floor[]) => {
        this._floorListSig.set(floorList);
      });
  }

  getFloorByName(floorName: string): Signal<Floor> {
    return computed(
      () => this._floorListSig().find((floor: Floor) => (floor ? floor.name === floorName : false)) || ({} as Floor),
    );
  }

  addFloor(newFloor: Floor): void {
    SignalArrayUtil.addItem(newFloor, this._floorListSig);
    this._httpFloorService.storeFloorList(this._floorListSig());
  }

  updateFloor(oldFloor: Floor, updatedFloor: Floor): void {
    SignalArrayUtil.replaceItem(oldFloor, this._floorListSig, updatedFloor);
    this._httpFloorService.storeFloorList(this._floorListSig());
  }

  deleteFloor(deletedFloor: Floor): void {
    SignalArrayUtil.deleteItem(deletedFloor, this._floorListSig);
    this._httpFloorService.storeFloorList(this._floorListSig());
  }
}
