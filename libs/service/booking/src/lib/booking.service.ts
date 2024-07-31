import { inject, Injectable } from '@angular/core';
import { AdminBuildingService } from '@free-spot-service/building';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { AdminFloorService } from '@free-spot-service/floor';
import { AdminRoomService } from '@free-spot-service/room';
import { BookedEvent, Floor, Group, SemiGroup, TimetableActivityItem, TimeTableItem } from '@free-spot/models';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  private _adminBuildingService: AdminBuildingService = inject(AdminBuildingService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);

  init(): void {
    this._adminRoomService.init();
    this._adminFloorService.init();
    this._adminBuildingService.init();
    this._adminFacultyService.init();
  }

  generateBooking(timetableActivityItem: TimetableActivityItem): BookedEvent {
    return {
      ...this._getLocation(timetableActivityItem.roomName),
      activityType: timetableActivityItem.activityType,
      subjectItem: timetableActivityItem.subjectItem,
      date: timetableActivityItem.date,
      startHour: timetableActivityItem.startHour,
      endHour: timetableActivityItem.endHour,
    };
  }

  generateUserBookedItems(group: Group, addingBooking: boolean, semiGroup?: SemiGroup): BookedEvent[] {
    const newUserBookingList: BookedEvent[] = [];
    this._getUserTimetableItems(group, semiGroup).forEach((timeTableItem: TimeTableItem) => {
      timeTableItem.activities.forEach((timetableActivity: TimetableActivityItem) => {
        newUserBookingList.push(this.generateBooking(timetableActivity));
        this._adminFacultyService.updateTimetableActivitySpots(timetableActivity, addingBooking);
        this._adminBuildingService.updateTimetableActivitySpots(timetableActivity, addingBooking);
        this._adminFloorService.updateTimetableActivitySpots(timetableActivity, addingBooking);
        this._adminRoomService.updateTimetableActivitySpots(timetableActivity, addingBooking);
      });
    });

    return newUserBookingList;
  }

  generateUserBookedItemByActivity(
    timetableActivity: TimetableActivityItem,
    addingBooking: boolean,
    updateFaculty?: boolean,
  ): BookedEvent {
    this._adminBuildingService.updateTimetableActivitySpots(timetableActivity, addingBooking);
    this._adminFloorService.updateTimetableActivitySpots(timetableActivity, addingBooking);
    this._adminRoomService.updateTimetableActivitySpots(timetableActivity, addingBooking);
    if (updateFaculty !== undefined && updateFaculty !== null && updateFaculty) {
      this._adminFacultyService.updateTimetableActivitySpots(timetableActivity, addingBooking);
    }
    return this.generateBooking(timetableActivity);
  }

  private _getUserTimetableItems(group: Group, semiGroup?: SemiGroup): TimeTableItem[] {
    const timetableItemList: TimeTableItem[] = [];
    if (semiGroup !== null && semiGroup !== undefined) {
      semiGroup.timetable?.forEach((timetableItem: TimeTableItem) =>
        timetableItem.activities ? timetableItemList.push(timetableItem) : '',
      );
    } else {
      group.timetable?.forEach((timetableItem: TimeTableItem) =>
        timetableItem.activities ? timetableItemList.push(timetableItem) : '',
      );
    }
    return timetableItemList;
  }

  private _getLocation(roomName: string): Pick<BookedEvent, 'buildingName' | 'floorName' | 'roomName'> {
    const activityFloor: Floor = this._adminFloorService.getFloorByName(
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
