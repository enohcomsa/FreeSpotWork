import {
  type EventsCatalogBuilding,
  type EventsCatalogEvent,
  type EventsCatalogRoom,
} from '@free-spot/events-catalog/domain';
import { type EventCardVm } from '@free-spot/events-catalog/ui';

export function toEventCardVm(
  event: EventsCatalogEvent,
  buildings: EventsCatalogBuilding[],
  rooms: EventsCatalogRoom[],
  registeredEventIds: Set<string>,
): EventCardVm {
  const building = buildings.find((item) => item.id === event.buildingId);
  const room = rooms.find((item) => item.id === event.roomId);

  const totalSpotsNumber = room?.totalSpotsNumber ?? 0;
  const unavailableSpots = room?.unavailableSpots ?? 0;

  return {
    id: event.id,
    name: event.name,
    date: event.date,
    buildingName: building?.name ?? '',
    buildingAddress: building?.address ?? '',
    roomName: room?.name ?? '',
    freeSpots: totalSpotsNumber - unavailableSpots - event.reservedSpots,
    bookedSpots: totalSpotsNumber,
    reservedSpots: event.reservedSpots,
    isRegistered: registeredEventIds.has(event.id),
  };
}
