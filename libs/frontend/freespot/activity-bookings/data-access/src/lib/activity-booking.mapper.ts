import { Booking } from '@free-spot-domain/booking';
import { TimetableActivity } from '@free-spot/academic-schedule/domain';
import { SubjectItem } from '@free-spot-domain/subject';
import { Room } from '@free-spot-domain/room';
import { Building } from '@free-spot-domain/building';
import { Floor } from '@free-spot-domain/floor';
import { ActivityBookingVm } from './activity-booking.model';

export function mapToActivityBookingVm(
  booking: Booking,
  activity: TimetableActivity,
  subject: SubjectItem,
  room: Room,
  building: Building,
  floor: Floor
): ActivityBookingVm {
  return {
    id: booking.id,
    activityType: booking.activityType,
    subjectName: subject?.shortName || subject?.name || '',
    buildingName: building?.name || '',
    floorName: floor?.name || '',
    roomName: room?.name || '',
    date: activity?.date || '',
    startHour: activity?.startHour || 0,
    endHour: activity?.endHour || 0,
  };
}
