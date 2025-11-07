import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateRoomCmd, Room, UpdateRoomCmd } from '@free-spot-domain/room';
import { WeekDay } from '@free-spot/enums';
import { RoomLegacy, SubjectItemLegacy, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpRoomService } from '@http-free-spot/room';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminRoomService {
  private _httpRoomService: HttpRoomService = inject(HttpRoomService);
  private readonly _destroyRef = inject(DestroyRef);

  /**
   * @deprecated Legacy Firebase-era state.
   * Replaced by server-sourced domain models.
   */
  private _roomListSigLegacy: WritableSignal<RoomLegacy[]> = signal([]);
  private _roomListSig: WritableSignal<Room[]> = signal([]);

  /**
   * @deprecated Legacy Firebase-era state.
   * Replaced by server-sourced domain models.
   */
  roomListSigLegacy = this._roomListSigLegacy.asReadonly();
  roomListSig = this._roomListSig.asReadonly();


  init(): void {
    /**
 * @deprecated Legacy Firebase-era initialization / list fetch.
 * Use the new REST endpoints and domain streams instead.
 */
    if (!this._roomListSigLegacy().length) {
      this._httpRoomService
        .getRoomList()
        .pipe(take(1))
        .subscribe((roomList: RoomLegacy[]) => {
          this._roomListSigLegacy.set(roomList?.filter((room: RoomLegacy) => room !== null));
        });
    }


    if (!this._roomListSig().length) {
      this._httpRoomService
        .listRooms$()
        .pipe(take(1))
        .subscribe((roomList: Room[]) => {
          this._roomListSig.set(roomList);
        });
    }
  }

  /**
   * @deprecated Legacy helper based on Firebase-era state.
   * Use id-based selectors from the new store/services.
   */
  getRoomByName(roomName: string): Signal<RoomLegacy> {
    return computed(
      () => this.roomListSigLegacy().find((room: RoomLegacy) => room.name === roomName) || ({} as RoomLegacy),
    );
  }

  //new
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
  //end new


  /**
   * @deprecated Legacy Firebase-era query on in-memory timetable.
   * Replace with server-backed queries / endpoints.
   */
  getTimetableActivitiesByWeekDayAndSubject(
    weekDay: WeekDay,
    subject: SubjectItemLegacy,
  ): TimetableActivityItem[] {
    if (this._roomListSigLegacy()) {
      const weeDayTimetableActivities: TimetableActivityItem[] = (
        [
          ...this._roomListSigLegacy().map((room: RoomLegacy) =>
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

  /**
   * @deprecated Legacy Firebase-era mutation of nested timetable state.
   * Use dedicated endpoints and server-side concurrency controls.
   */
  updateTimetableActivitySpots(
    changedTimetableActivity: TimetableActivityItem,
    addingBooking: boolean,
  ): void {
    const newRoomList: RoomLegacy[] = this._roomListSigLegacy().map((room: RoomLegacy) => {
      return this._updateTimetableActivityFromRoom(room, changedTimetableActivity, addingBooking);
    });

    this._roomListSigLegacy.set(newRoomList);
    this._httpRoomService.storeRoomList(this._roomListSigLegacy());
  }

  /**
   * @deprecated Legacy Firebase-era add.
   * Use POST /rooms in the new API.
   */
  addRoom(newRoom: RoomLegacy): void {
    SignalArrayUtil.addItem(newRoom, this._roomListSigLegacy);
    this._httpRoomService.storeRoomList(this._roomListSigLegacy());
  }

  /**
   * @deprecated Legacy Firebase-era update.
   * Use PATCH /rooms/{id} in the new API.
   */
  updateRoom(oldRoom: RoomLegacy, updatedRoom: RoomLegacy): void {
    SignalArrayUtil.replaceItem(oldRoom, this._roomListSigLegacy, updatedRoom);
    this._httpRoomService.storeRoomList(this._roomListSigLegacy());
  }

  /**
   * @deprecated Legacy Firebase-era delete.
   * Use DELETE /rooms/{id} in the new API.
   */
  deleteRoom(deletedRoom: RoomLegacy): void {
    const updatedRoomList: RoomLegacy[] = this._roomListSigLegacy().filter(
      (room: RoomLegacy) => room.name !== deletedRoom.name,
    );
    this._roomListSigLegacy.set(updatedRoomList);
    this._httpRoomService.storeRoomList(this._roomListSigLegacy());
  }

  /**
   * @deprecated Legacy Firebase-era local mutation helper.
   */
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

  /**
   * @deprecated Legacy Firebase-era equality helper.
   */
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
