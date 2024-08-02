import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { WeekDay } from '@free-spot/enums';
import { Room, SubjectItem, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpRoomService } from '@http-free-spot/room';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminRoomService {
  private _httpRoomService: HttpRoomService = inject(HttpRoomService);

  private _roomListSig: WritableSignal<Room[]> = signal([]);
  roomListSig = this._roomListSig.asReadonly();

  init(): void {
    this._httpRoomService
      .getRoomList()
      .pipe(take(1))
      .subscribe((roomList: Room[]) => {
        this._roomListSig.set(roomList?.filter((room: Room) => room !== null));
      });
  }

  getRoomByName(roomName: string): Signal<Room> {
    return computed(() => this.roomListSig().find((room: Room) => room.name === roomName) || ({} as Room));
  }

  getTimetableActivitiesByWeekDayAndSubject(weekDay: WeekDay, subject: SubjectItem): TimetableActivityItem[] {
    if (this._roomListSig()) {
      const weeDayTimetableActivities: TimetableActivityItem[] = (
        [
          ...this._roomListSig().map((room: Room) =>
            room.timetable.filter(
              (timetableItem: TimeTableItem) => timetableItem.weekDay === weekDay && !!timetableItem.activities,
            ),
          ),
        ].flat(Infinity) as TimeTableItem[]
      )
        .map((timetableItem: TimeTableItem) => timetableItem.activities)
        .flat(Infinity) as TimetableActivityItem[];

      const foundTimetableActivities =
        weeDayTimetableActivities?.filter(
          (timetableActivity: TimetableActivityItem) => timetableActivity.subjectItem?.name === subject?.name,
        ) || [];
      return foundTimetableActivities;
    } else {
      return [];
    }
  }
  updateTimetableActivitySpots(changedTimetableActivity: TimetableActivityItem, addingBooking: boolean): void {
    const newRoomList: Room[] = this._roomListSig().map((room: Room) => {
      return this._updateTimetableActivityFromRoom(room, changedTimetableActivity, addingBooking);
    });

    this._roomListSig.set(newRoomList);
    this._httpRoomService.storeRoomList(this._roomListSig());
  }

  addRoom(newRoom: Room): void {
    SignalArrayUtil.addItem(newRoom, this._roomListSig);
    this._httpRoomService.storeRoomList(this._roomListSig());
  }

  updateRoom(oldRoom: Room, updatedRoom: Room): void {
    SignalArrayUtil.replaceItem(oldRoom, this._roomListSig, updatedRoom);
    this._httpRoomService.storeRoomList(this._roomListSig());
  }

  deleteRoom(deletedRoom: Room): void {
    const updatedRoomList: Room[] = this._roomListSig().filter((room: Room) => room.name !== deletedRoom.name);
    this._roomListSig.set(updatedRoomList);
    this._httpRoomService.storeRoomList(this._roomListSig());
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
