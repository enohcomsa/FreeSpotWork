import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateFloorCmd, Floor, UpdateFloorCmd } from '@free-spot-domain/floor';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpFloorService } from '@http-free-spot/floor';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminFloorService {
  private _httpFloorService: HttpFloorService = inject(HttpFloorService);
  private readonly _destroyRef = inject(DestroyRef);

  private _floorListSig: WritableSignal<Floor[]> = signal([]);
  floorListSig = this._floorListSig.asReadonly();

  init(): void {
    if (!this._floorListSig().length) {
      this._httpFloorService
        .listFloors$()
        .pipe(take(1))
        .subscribe((floorList: Floor[]) => {
          this._floorListSig.set(floorList);
        });
    }
  }

  selectFloorsByBuildingId(buildingId: string): Signal<Floor[]> {
    return computed(() => this.floorListSig().filter((floor: Floor) => floor.buildingId === buildingId));
  }

  getSignalById(id: string): Signal<Floor> {
    return computed(() => this.floorListSig().find((floor: Floor) => floor.id === id) || ({} as Floor))
  }

  getById(id: string): Observable<Floor> {
    return this._httpFloorService.getFloorById$(id);
  }

  create(input: CreateFloorCmd): void {
    this._httpFloorService.createFloor$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._floorListSig));
  }

  update(id: string, patch: UpdateFloorCmd): void {
    this._httpFloorService.updateFloor$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._floorListSig));
  }

  remove(id: string): void {
    this._httpFloorService.deleteFloor$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._floorListSig));
  }
}
