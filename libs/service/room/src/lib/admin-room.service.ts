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
        this._roomListSig.set(roomList.filter((room: Room) => room !== null));
      });
  }

  getRoomByName(roomName: string): Signal<Room> {
    return computed(() => this.roomListSig().find((room: Room) => room.name === roomName) || ({} as Room));
  }

  getTimetableActivitiesByWeekDayAndSubject(weekDay: WeekDay, subject: SubjectItem): TimetableActivityItem[] {
    const weeDayTimetableActivities: TimetableActivityItem[] = (
      [
        ...this.roomListSig().map((room: Room) =>
          room.timetable.filter(
            (timetableItem: TimeTableItem) => timetableItem.weekDay === weekDay && !!timetableItem.activities,
          ),
        ),
      ].flat(Infinity) as TimeTableItem[]
    )
      .map((timetableItem: TimeTableItem) => timetableItem.activities)
      .flat(Infinity) as TimetableActivityItem[];

    const foundTimetableActivities = weeDayTimetableActivities.filter(
      (timetableActivity: TimetableActivityItem) => timetableActivity.subjectItem?.name === subject?.name,
    );
    return foundTimetableActivities;
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
    SignalArrayUtil.deleteItem(deletedRoom, this._roomListSig);
    this._httpRoomService.storeRoomList(this._roomListSig());
  }
}
