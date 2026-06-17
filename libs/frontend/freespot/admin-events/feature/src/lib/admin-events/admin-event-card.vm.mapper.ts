import { AdminSpecialEvent, AdminEventsBuilding, AdminEventsRoom } from "@free-spot/admin-events/domain";
import { AdminEventCardVm } from "@free-spot/admin-events/ui";

export function toAdminEventCardVm(
  event: AdminSpecialEvent,
  building: AdminEventsBuilding,
  room: AdminEventsRoom,
): AdminEventCardVm {
  return {
    id: event.id,
    name: event.name,
    date: event.date,
    buildingName: building.name,
    buildingAddress: building.address,
    roomName: room.name,
    freeSpots: room.totalSpotsNumber - room.unavailableSpots - event.reservedSpots,
    bookedSpots: room.unavailableSpots,
    reservedSpots: event.reservedSpots,
  };
}
