import { Injectable, Signal, computed, inject, signal } from '@angular/core';

import {
  AdminEventsBuilding,
  AdminEventsRoom,
  AdminSpecialEvent,
  CreateAdminSpecialEventCmd,
  UpdateAdminSpecialEventCmd,
} from '@free-spot/admin-events/domain';

import { HttpAdminEventsService } from './http-admin-events.service';

@Injectable({ providedIn: 'root' })
export class AdminEventsStore {
  private readonly http = inject(HttpAdminEventsService);

  private readonly eventsSig = signal<AdminSpecialEvent[]>([]);
  private readonly buildingsSig = signal<AdminEventsBuilding[]>([]);
  private readonly roomsSig = signal<AdminEventsRoom[]>([]);

  readonly eventListSig: Signal<AdminSpecialEvent[]> = this.eventsSig.asReadonly();
  readonly buildingListSig: Signal<AdminEventsBuilding[]> = this.buildingsSig.asReadonly();

  init() {
    this.http.load$().subscribe(({ events, buildings, rooms }) => {
      this.eventsSig.set(events);
      this.buildingsSig.set(buildings);
      this.roomsSig.set(rooms);
    });
  }

  getBuildingById(id: string) {
    return computed(() => this.buildingsSig().find((building) => building.id === id));
  }

  getRoomById(id: string) {
    return computed(() => this.roomsSig().find((room) => room.id === id));
  }

  selectRoomsByBuildingId(id: string) {
    return computed(() => this.roomsSig().filter((room) => room.buildingId === id));
  }

  createEvent(cmd: CreateAdminSpecialEventCmd) {
    this.http.createEvent$(cmd).subscribe((event) => {
      this.eventsSig.update((events) => [...events, event]);
    });
  }

  updateEvent(id: string, cmd: UpdateAdminSpecialEventCmd) {
    this.http.updateEvent$(id, cmd).subscribe((updatedEvent) => {
      this.eventsSig.update((events) =>
        events.map((event) => (event.id === id ? updatedEvent : event)),
      );
    });
  }

  deleteEvent(id: string) {
    this.http.deleteEvent$(id).subscribe(() => {
      this.eventsSig.update((events) => events.filter((event) => event.id !== id));
    });
  }
}
