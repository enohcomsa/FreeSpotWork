import {
  type ActivityBooking,
  type ActivityBookingActivity,
  type ActivityBookingBuilding,
  type ActivityBookingCardVm,
  type ActivityBookingFloor,
  type ActivityBookingRoom,
  type ActivityBookingSubject,
} from '@free-spot/activity-bookings/domain';

export function mapToActivityBookingVm(
  booking: ActivityBooking,
  activity: ActivityBookingActivity,
  subject: ActivityBookingSubject,
  room: ActivityBookingRoom,
  building: ActivityBookingBuilding,
  floor: ActivityBookingFloor
): ActivityBookingCardVm {
  return {
    id: booking.id,
    activityType: booking.activityType,
    subjectName: subject.shortName ?? subject.name,
    buildingName: building.name,
    floorName: floor.name,
    roomName: room.name,
    date: activity.date,
    startHour: activity.startHour,
    endHour: activity.endHour,
  };
}
