import { inject, Injectable } from '@angular/core';
import { BuildingService } from '@free-spot-service/building';
import { AdminEventService } from '@free-spot-service/event';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { AdminFloorService } from '@free-spot-service/floor';
import { AdminRoomService } from '@free-spot-service/room';
import { Event } from '@free-spot/enums';
import { BookedEvent, FloorLegacy, GroupLegacy, SemiGroup, TimetableActivityItemLegacy, TimeTableItemLecagy } from '@free-spot/models';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  // private _adminBuildingService: BuildingService = inject(BuildingService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _adminEventService: AdminEventService = inject(AdminEventService);

  init(): void {
    this._adminRoomService.init();
    this._adminFloorService.init();
    // this._adminBuildingService.init();
    this._adminFacultyService.init();
    this._adminEventService.init();
  }

  generateBooking(timetableActivityItem: TimetableActivityItemLegacy): BookedEvent {
    if (timetableActivityItem.activityType === Event.SPECIAL_EVENT) {
      return {
        ...this._getLocation(timetableActivityItem.roomName),
        activityType: timetableActivityItem.activityType,
        subjectItem: timetableActivityItem.subjectItem,
        date: timetableActivityItem.date,
        startHour: timetableActivityItem.startHour,
        endHour: timetableActivityItem.endHour,
        weekParity: timetableActivityItem.weekParity,
        name: timetableActivityItem.name,
      };
    } else {
      return {
        ...this._getLocation(timetableActivityItem.roomName),
        activityType: timetableActivityItem.activityType,
        subjectItem: timetableActivityItem.subjectItem,
        date: timetableActivityItem.date,
        startHour: timetableActivityItem.startHour,
        endHour: timetableActivityItem.endHour,
        weekParity: timetableActivityItem.weekParity,
      };
    }
  }

  generateUserBookedItems(group: GroupLegacy, addingBooking: boolean, semiGroup?: SemiGroup): BookedEvent[] {
    const newUserBookingList: BookedEvent[] = [];
    this._getUserTimetableItems(group, semiGroup).forEach((timeTableItem: TimeTableItemLecagy) => {
      timeTableItem.activities.forEach((timetableActivity: TimetableActivityItemLegacy) => {
        newUserBookingList.push(this.generateBooking(timetableActivity));
        this._adminFacultyService.updateTimetableActivitySpots(timetableActivity, addingBooking);
        // this._adminBuildingService.updateTimetableActivitySpots(timetableActivity, addingBooking);
        this._adminFloorService.updateTimetableActivitySpots(timetableActivity, addingBooking);
        this._adminRoomService.updateTimetableActivitySpots(timetableActivity, addingBooking);
      });
    });

    return newUserBookingList;
  }

  generateUserBookedItemByActivity(
    timetableActivity: TimetableActivityItemLegacy,
    addingBooking: boolean,
    updateFaculty?: boolean,
  ): BookedEvent {
    // this._adminBuildingService.updateTimetableActivitySpots(timetableActivity, addingBooking);
    this._adminFloorService.updateTimetableActivitySpots(timetableActivity, addingBooking);
    this._adminRoomService.updateTimetableActivitySpots(timetableActivity, addingBooking);
    if (updateFaculty !== undefined && updateFaculty !== null && updateFaculty) {
      this._adminFacultyService.updateTimetableActivitySpots(timetableActivity, addingBooking);
    }
    return this.generateBooking(timetableActivity);
  }

  generateSpecialEventBookedItemByActivity(timetableActivity: TimetableActivityItemLegacy, addingBooking: boolean): BookedEvent {
    this._adminEventService.updateEventSpots(timetableActivity.name as string, addingBooking);
    return this.generateBooking(timetableActivity);
  }

  private _getUserTimetableItems(group: GroupLegacy, semiGroup?: SemiGroup): TimeTableItemLecagy[] {
    const timetableItemList: TimeTableItemLecagy[] = [];
    if (semiGroup !== null && semiGroup !== undefined) {
      semiGroup.timetable?.forEach((timetableItem: TimeTableItemLecagy) =>
        timetableItem.activities ? timetableItemList.push(timetableItem) : '',
      );
    } else {
      group.timetable?.forEach((timetableItem: TimeTableItemLecagy) =>
        timetableItem.activities ? timetableItemList.push(timetableItem) : '',
      );
    }
    return timetableItemList;
  }

  private _getLocation(roomName: string): Pick<BookedEvent, 'buildingName' | 'floorName' | 'roomName'> {
    const activityFloor: FloorLegacy = this._adminFloorService.getFloorByName(
      this._adminRoomService.getRoomByName(roomName)().floorName,
    )();
    const newLocation: Pick<BookedEvent, 'buildingName' | 'floorName' | 'roomName'> = {
      buildingName: activityFloor.buildingName,
      floorName: activityFloor.name,
      roomName: roomName,
    };

    return newLocation;
  }
}
