import { Injectable, Signal, inject } from '@angular/core';
import {
  SpecialEvent,
  CreateSpecialEventCmd,
  UpdateSpecialEventCmd,
} from '@free-spot-domain/event';
import { Building } from '@free-spot-domain/building';
import { Room } from '@free-spot-domain/room';

import { AdminEventService } from '@free-spot-service/event';
import { BuildingService } from '@free-spot-service/building';
import { AdminRoomService } from '@free-spot-service/room';

@Injectable({ providedIn: 'root' })
export class AdminEventsStore {
  private _eventService = inject(AdminEventService);
  private _buildingService = inject(BuildingService);
  private _roomService = inject(AdminRoomService);

  readonly eventListSig: Signal<SpecialEvent[]> = this._eventService.eventListSig;
  readonly buildingListSig: Signal<Building[]> = this._buildingService.buildingListSig;

  init() {
    this._eventService.init();
    this._buildingService.init();
    this._roomService.init();
  }

  getBuildingById(id: string) {
    return this._buildingService.getSignalById(id);
  }

  getRoomById(id: string) {
    return this._roomService.getSignalById(id);
  }

  selectRoomsByBuildingId(id: string) {
    return this._roomService.selectRoomsByBuildingId(id);
  }

  createEvent(cmd: CreateSpecialEventCmd) {
    this._eventService.create(cmd);
  }

  updateEvent(id: string, cmd: UpdateSpecialEventCmd) {
    this._eventService.update(id, cmd);
  }

  deleteEvent(id: string) {
    this._eventService.remove(id);
  }
}
