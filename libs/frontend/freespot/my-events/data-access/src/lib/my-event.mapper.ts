import { Booking } from '@free-spot-domain/booking';
import { SpecialEvent } from '@free-spot-domain/event';
import { Building } from '@free-spot-domain/building';
import { Floor } from '@free-spot-domain/floor';
import { Room } from '@free-spot-domain/room';
import { MyEventVm } from './my-event.model';

export function mapToMyEventVm(
  booking: Booking,
  event: SpecialEvent,
  building: Building,
  floor: Floor,
  room: Room
): MyEventVm {
  return {
    id: booking.id,
    name: event?.name || '',
    buildingName: building?.name || '',
    floorName: floor?.name || '',
    roomName: room?.name || '',
    date: event?.date ?? null,
    startHour: event?.startHour ?? 0,
  };
}
