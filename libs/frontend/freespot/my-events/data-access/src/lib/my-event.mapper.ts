import {
  type MyEventCardVm,
  type MyEventsBooking,
  type MyEventsBuilding,
  type MyEventsEvent,
  type MyEventsFloor,
  type MyEventsRoom,
} from '@free-spot/my-events/domain';

export function mapToMyEventVm(
  booking: MyEventsBooking,
  event: MyEventsEvent,
  building: MyEventsBuilding | null,
  floor: MyEventsFloor | null,
  room: MyEventsRoom | null
): MyEventCardVm {
  return {
    id: booking.id,
    name: event.name,
    buildingName: building?.name ?? '',
    floorName: floor?.name ?? '',
    roomName: room?.name ?? '',
    date: event.date,
    startHour: event.startHour,
  };
}
