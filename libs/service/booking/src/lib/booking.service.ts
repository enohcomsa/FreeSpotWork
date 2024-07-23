import { Injectable } from '@angular/core';
import { BookedEvent, TimetableActivityItem } from '@free-spot/models';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  generateBooking(
    location: Pick<BookedEvent, 'buildingName' | 'floorName' | 'roomName'>,
    date: Date,
    timetableActivityItem: TimetableActivityItem,
  ): BookedEvent {
    return {
      ...location,
      activityType: timetableActivityItem.activityType,
      subjectItem: timetableActivityItem.subjectItem,
      date: date,
      startHour: timetableActivityItem.startHour,
      endHour: timetableActivityItem.endHour,
    };
  }
}
