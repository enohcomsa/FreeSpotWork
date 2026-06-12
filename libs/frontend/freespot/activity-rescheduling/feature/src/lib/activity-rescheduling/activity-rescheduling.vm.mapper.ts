import { ActivityReschedulingActivity, ActivityReschedulingBooking, ActivityReschedulingBuilding, ActivityReschedulingFloor, ActivityReschedulingOption, ActivityReschedulingRoom, ActivityReschedulingSubject } from "@free-spot/activity-rescheduling/domain";
import { RescheduleOptionCardVm } from "@free-spot/activity-rescheduling/ui";
import { ReschedulableBookingVm } from "./reschedulable-booking.vm";

export function mapToReschedulableBookingVm(
  booking: ActivityReschedulingBooking,
  subjectList: ActivityReschedulingSubject[],
  activityList: ActivityReschedulingActivity[]): ReschedulableBookingVm {
  const subject = booking.subjectId
    ? subjectList.find((item) => item.id === booking.subjectId)
    : null;
  const activity = activityList.find((item) => item.id === booking.activityId);

  const label = [
    booking.activityType,
    subject?.shortName ?? subject?.name,
    activity?.date ? new Date(activity.date).toLocaleDateString() : '',
    activity?.startHour != null && activity?.endHour != null
      ? `${activity.startHour}-${activity.endHour}`
      : '',
  ]
    .filter(Boolean)
    .join(' · ');

  return { id: booking.id, label };
}

export function mapToRescheduleOptionCardVm(
  option: ActivityReschedulingOption,
  activityList: ActivityReschedulingActivity[],
  subjectList: ActivityReschedulingSubject[],
  roomList: ActivityReschedulingRoom[],
  buildingList: ActivityReschedulingBuilding[],
  floorList: ActivityReschedulingFloor[]
): RescheduleOptionCardVm | null {
  const activity = activityList.find((current) => current.id === option.activityId);

  if (!activity) {
    return null;
  }

  const subject = subjectList.find((current) => current.id === activity.subjectId);
  const room = roomList.find((current) => current.id === activity.roomId);
  const building = buildingList.find((current) => current.id === room?.buildingId);
  const floor = floorList.find((current) => current.id === room?.floorId);

  return {
    id: activity.id,
    subjectName: subject?.shortName ?? subject?.name ?? '',
    buildingName: building?.name ?? '',
    floorName: floor?.name ?? '',
    roomName: room?.name ?? '',
    date: activity.date,
    startHour: activity.startHour,
    endHour: activity.endHour,
    freeSpots: option.freeSpots,
  };
}
