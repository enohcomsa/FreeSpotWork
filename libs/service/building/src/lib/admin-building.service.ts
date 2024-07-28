import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Building, Floor, Room, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpBuildingService } from '@http-free-spot/building';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminBuildingService {
  private _httpBuildingService: HttpBuildingService = inject(HttpBuildingService);

  private _buildingListSig: WritableSignal<Building[]> = signal([]);
  buildingListSig = this._buildingListSig.asReadonly();

  init(): void {
    this._httpBuildingService
      .getBuildingList()
      .pipe(take(1))
      .subscribe((buildingList: Building[]) => {
        this._buildingListSig.set(buildingList?.filter((building: Building) => building !== null));
      });
  }

  getBuildingByName(buildingName: string): Signal<Building> {
    return computed(
      () => this.buildingListSig().find((building: Building) => building.name === buildingName) || ({} as Building),
    );
  }

  updateTimetableActivitySpots(changedTimetableActivity: TimetableActivityItem, addingBooking: boolean): void {
    const newBuildingList: Building[] = this._buildingListSig().map((building: Building) => {
      return {
        ...building,
        floorList:
          building.floorList?.map((floor: Floor) => {
            return {
              ...floor,
              roomList:
                floor.roomList?.map((room: Room) =>
                  this._updateTimetableActivityFromRoom(room, changedTimetableActivity, addingBooking),
                ) || [],
            };
          }) || [],
      };
    });
    this._buildingListSig.set(newBuildingList);
    this._httpBuildingService.storeBuildingList(this._buildingListSig());
  }

  addBuilding(newBuilding: Building): void {
    SignalArrayUtil.addItem(newBuilding, this._buildingListSig);
    this._httpBuildingService.storeBuildingList(this._buildingListSig());
  }

  updateBuilding(oldBuilding: Building, updatedBuilding: Building): void {
    SignalArrayUtil.replaceItem(oldBuilding, this._buildingListSig, updatedBuilding);
    this._httpBuildingService.storeBuildingList(this._buildingListSig());
  }

  deleteBuilding(deletedBuilding: Building): void {
    SignalArrayUtil.deleteItem(deletedBuilding, this._buildingListSig);
    this._httpBuildingService.storeBuildingList(this._buildingListSig());
  }

  private _updateTimetableActivityFromRoom(
    room: Room,
    changedTimetableActivity: TimetableActivityItem,
    addingBooking: boolean,
  ): Room {
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
      timetableActivity1.date === timetableActivity2.date
    );
  }
}
