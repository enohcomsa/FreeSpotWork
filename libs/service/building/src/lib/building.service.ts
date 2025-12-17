import { computed, DestroyRef, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { BuildingLegacy, FloorLegacy, RoomLegacy, TimetableActivityItemLegacy, TimeTableItemLecagy } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpBuildingService } from '@http-free-spot/building';
import { Building } from '@free-spot-domain/building';
import { CreateBuildingCmd, UpdateBuildingCmd } from '@free-spot-domain/building';
import { Observable, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private _httpBuildingsService: HttpBuildingService = inject(HttpBuildingService);
  private readonly _destroyRef = inject(DestroyRef);

  /** @deprecated Legacy Firebase-era state. */
  private _buildingListSigLegacy: WritableSignal<BuildingLegacy[]> = signal<BuildingLegacy[]>([]);
  private _buildingListSig: WritableSignal<Building[]> = signal<Building[]>([]);

  /** @deprecated Legacy Firebase-era state. */
  buildingListSigLegacy: Signal<BuildingLegacy[]> = this._buildingListSigLegacy.asReadonly();
  buildingListSig: Signal<Building[]> = this._buildingListSig.asReadonly();

  init(): void {
    /** @deprecated Legacy Firebase-era fetch. */
    if (!this._buildingListSigLegacy().length) {
      this._httpBuildingsService
        .getBuildingList()
        .pipe(take(1))
        .subscribe((buildingList: BuildingLegacy[]) => {
          console.log(buildingList);

          this._buildingListSigLegacy.set(buildingList?.filter((building: BuildingLegacy) => building !== null));
        });
    }

    if (!this._buildingListSig().length) {
      this._httpBuildingsService
        .listBuildings$()
        .pipe(take(1))
        .subscribe((buildingList: Building[]) => {
          this._buildingListSig.set(buildingList);
        });
    }
  }

  /** @deprecated Legacy helper based on Firebase-era state. */
  getBuildingByName(buildingName: string): Signal<BuildingLegacy> {
    return computed(
      () => this.buildingListSigLegacy().find((building: BuildingLegacy) => building.name === buildingName) || ({} as BuildingLegacy),
    );
  }

  getSignalById(id: string): Signal<Building> {
    return computed(() => this.buildingListSig().find((building: Building) => building.id === id) || ({} as Building))
  }

  getById(id: string): Observable<Building> {
    return this._httpBuildingsService.getBuildingById$(id);
  }

  create(input: CreateBuildingCmd): void {
    this._httpBuildingsService.createBuilding$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._buildingListSig));
  }

  update(id: string, patch: UpdateBuildingCmd): void {
    this._httpBuildingsService.updateBuilding$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._buildingListSig));
  }

  remove(id: string): void {
    this._httpBuildingsService.deleteBuilding$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._buildingListSig));
  }

  /** @deprecated Legacy Firebase-era mutation of nested timetable state. */
  updateTimetableActivitySpots(changedTimetableActivity: TimetableActivityItemLegacy, addingBooking: boolean): void {
    const newBuildingList: BuildingLegacy[] = this._buildingListSigLegacy().map((building: BuildingLegacy) => {
      return {
        ...building,
        floorList:
          building.floorList?.map((floor: FloorLegacy) => {
            return {
              ...floor,
              roomList:
                floor.roomList?.map((room: RoomLegacy) =>
                  this._updateTimetableActivityFromRoom(room, changedTimetableActivity, addingBooking),
                ) || [],
            };
          }) || [],
      };
    });
    this._buildingListSigLegacy.set(newBuildingList);
    this._httpBuildingsService.storeBuildingList(this._buildingListSigLegacy());
  }

  /** @deprecated Legacy Firebase-era add. */
  addBuilding(newBuilding: BuildingLegacy): void {
    SignalArrayUtil.addItem<BuildingLegacy>(newBuilding, this._buildingListSigLegacy);
    this._httpBuildingsService.storeBuildingList(this._buildingListSigLegacy());
  }

  /** @deprecated Legacy Firebase-era update. */
  updateBuilding(oldBuilding: BuildingLegacy, updatedBuilding: BuildingLegacy): void {
    SignalArrayUtil.replaceItem<BuildingLegacy>(oldBuilding, this._buildingListSigLegacy, updatedBuilding);
    this._httpBuildingsService.storeBuildingList(this._buildingListSigLegacy());
  }

  /** @deprecated Legacy Firebase-era delete. */
  deleteBuilding(deletedBuilding: BuildingLegacy): void {
    SignalArrayUtil.deleteItem<BuildingLegacy>(deletedBuilding, this._buildingListSigLegacy);
    this._httpBuildingsService.storeBuildingList(this._buildingListSigLegacy());
  }

  private _updateTimetableActivityFromRoom(
    room: RoomLegacy,
    changedTimetableActivity: TimetableActivityItemLegacy,
    addingBooking: boolean,
  ): RoomLegacy {
    const updated: RoomLegacy = {
      ...room,
      timetable: room.timetable.map((timeTableItem: TimeTableItemLecagy) => {
        return {
          ...timeTableItem,
          activities: timeTableItem.activities?.map((timetableActivity: TimetableActivityItemLegacy) => {
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
    return updated;
  }

  private _checkTimetebleActivityEquality(
    timetableActivity1: TimetableActivityItemLegacy,
    timetableActivity2: TimetableActivityItemLegacy,
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
