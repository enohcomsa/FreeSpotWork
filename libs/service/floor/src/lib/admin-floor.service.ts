import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateFloorCmd, Floor, UpdateFloorCmd } from '@free-spot-domain/floor';
import { FloorLegacy, RoomLegacy, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpFloorService } from '@http-free-spot/floor';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminFloorService {
  private _httpFloorService: HttpFloorService = inject(HttpFloorService);
  private readonly _destroyRef = inject(DestroyRef);


  /** @deprecated Legacy Firebase-era state. */
  private _floorListSigLegacy: WritableSignal<FloorLegacy[]> = signal([]);
  private _floorListSig: WritableSignal<Floor[]> = signal([]);
  /** @deprecated Legacy Firebase-era state. */
  floorListSigLegacy = this._floorListSigLegacy.asReadonly();
  floorListSig = this._floorListSig.asReadonly();

  init(): void {
    /** @deprecated Legacy Firebase-era fetch. */
    if (!this._floorListSigLegacy().length) {
      this._httpFloorService
        .getFloorList()
        .pipe(take(1))
        .subscribe((floorList: FloorLegacy[]) => {
          this._floorListSigLegacy.set(floorList?.filter((floor: FloorLegacy) => floor !== null));
        });
    }

    if (!this._floorListSig().length) {
      this._httpFloorService
        .listFloors$()
        .pipe(take(1))
        .subscribe((floorList: Floor[]) => {
          this._floorListSig.set(floorList);
        });
    }
  }
  /** @deprecated Legacy helper based on Firebase-era state. */
  getFloorByName(floorName: string): Signal<FloorLegacy> {
    return computed(() => this._floorListSigLegacy().find((floor: FloorLegacy) => floor.name === floorName) || ({} as FloorLegacy));
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

  /** @deprecated Legacy Firebase-era mutation of nested timetable state. */
  updateTimetableActivitySpots(changedTimetableActivity: TimetableActivityItem, addingBooking: boolean): void {
    const newFloorList: FloorLegacy[] = this._floorListSigLegacy().map((floor: FloorLegacy) => {
      return {
        ...floor,
        roomList:
          floor.roomList?.map((room: RoomLegacy) =>
            this._updateTimetableActivityFromRoom(room, changedTimetableActivity, addingBooking),
          ) || [],
      };
    });
    this._floorListSigLegacy.set(newFloorList);
    this._httpFloorService.storeFloorList(this._floorListSigLegacy());
  }
  /** @deprecated Legacy Firebase-era add. */
  addFloor(newFloor: FloorLegacy): void {
    SignalArrayUtil.addItem(newFloor, this._floorListSigLegacy);
    this._httpFloorService.storeFloorList(this._floorListSigLegacy());
  }
  /** @deprecated Legacy Firebase-era update. */
  updateFloor(oldFloor: FloorLegacy, updatedFloor: FloorLegacy): void {
    SignalArrayUtil.replaceItem(oldFloor, this._floorListSigLegacy, updatedFloor);
    this._httpFloorService.storeFloorList(this._floorListSigLegacy());
  }
  /** @deprecated Legacy Firebase-era delete. */
  deleteFloor(deletedFloor: FloorLegacy): void {
    SignalArrayUtil.deleteItem(deletedFloor, this._floorListSigLegacy);
    this._httpFloorService.storeFloorList(this._floorListSigLegacy());
  }

  private _updateTimetableActivityFromRoom(
    room: RoomLegacy,
    changedTimetableActivity: TimetableActivityItem,
    addingBooking: boolean,
  ): RoomLegacy {
    room = {
      ...room,
      timetable: room.timetable.map((timeTableItem: TimeTableItem) => {
        return {
          ...timeTableItem,
          activities: timeTableItem.activities?.map((timetableActivity: TimetableActivityItem) => {
            return this._checkTimetebleActivityEquality(changedTimetableActivity, timetableActivity)
              ? {
                ...timetableActivity,
                freeSpots: addingBooking ? timetableActivity.freeSpots - 1 : timetableActivity.freeSpots + 1,
                busySpots: addingBooking ? timetableActivity.busySpots + 1 : timetableActivity.busySpots - 1,
              }
              : timetableActivity;
          }),
        };
      }),
    };

    return room;
  }

  private _checkTimetebleActivityEquality(
    timetableActivity1: TimetableActivityItem,
    timetableActivity2: TimetableActivityItem,
  ): boolean {
    return (
      timetableActivity1.roomName === timetableActivity2.roomName &&
      timetableActivity1.subjectItem.name === timetableActivity2.subjectItem.name &&
      timetableActivity1.startHour === timetableActivity2.startHour &&
      timetableActivity1.weekParity === timetableActivity2.weekParity &&
      new Date(timetableActivity1.date).getTime() === new Date(timetableActivity2.date).getTime()
    );
  }
}
