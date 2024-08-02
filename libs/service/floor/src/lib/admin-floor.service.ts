import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Floor, Room, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
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
    if (!this._floorListSig().length) {
      this._httpFloorService
        .getFloorList()
        .pipe(take(1))
        .subscribe((floorList: Floor[]) => {
          this._floorListSig.set(floorList?.filter((floor: Floor) => floor !== null));
        });
    }
  }

  getFloorByName(floorName: string): Signal<Floor> {
    return computed(() => this._floorListSig().find((floor: Floor) => floor.name === floorName) || ({} as Floor));
  }

  updateTimetableActivitySpots(changedTimetableActivity: TimetableActivityItem, addingBooking: boolean): void {
    const newFloorList: Floor[] = this._floorListSig().map((floor: Floor) => {
      return {
        ...floor,
        roomList:
          floor.roomList?.map((room: Room) =>
            this._updateTimetableActivityFromRoom(room, changedTimetableActivity, addingBooking),
          ) || [],
      };
    });
    this._floorListSig.set(newFloorList);
    this._httpFloorService.storeFloorList(this._floorListSig());
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
      new Date(timetableActivity1.date).getTime() === new Date(timetableActivity2.date).getTime()
    );
  }
}
