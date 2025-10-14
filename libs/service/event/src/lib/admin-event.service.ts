import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { BuildingLegacy } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpEventService } from '@http-free-spot/event';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminEventService {
  private _httpEventService: HttpEventService = inject(HttpEventService);
  private _eventListSig: WritableSignal<BuildingLegacy[]> = signal([]);
  eventListSig = this._eventListSig.asReadonly();

  init(): void {
    if (!this._eventListSig().length) {
      this._httpEventService
        .getEventList()
        .pipe(take(1))
        .subscribe((eventList: BuildingLegacy[]) => {
          this._eventListSig.set(eventList?.filter((event: BuildingLegacy) => event !== null));
        });
    }
  }

  updateEventSpots(eventName: string, addingBooking: boolean): void {
    const newEventList: BuildingLegacy[] = this._eventListSig().map((event: BuildingLegacy) => {
      if (event.name === eventName) {
        return {
          ...event,
          freeSpots: addingBooking ? (event.freeSpots as number) - 1 : (event.freeSpots as number) + 1,
          busySpots: addingBooking ? (event.busySpots as number) + 1 : (event.busySpots as number) - 1,
        };
      } else {
        return event;
      }
    });

    this._eventListSig.set(newEventList);
    this._httpEventService.storeEventList(this._eventListSig());
  }

  getEventByName(eventName: string): Signal<BuildingLegacy> {
    return computed(() => this.eventListSig().find((event: BuildingLegacy) => event.name === eventName) || ({} as BuildingLegacy));
  }

  addEvent(newEvent: BuildingLegacy): void {
    SignalArrayUtil.addItem(newEvent, this._eventListSig);
    this._httpEventService.storeEventList(this._eventListSig());
  }

  updateEvent(oldEvent: BuildingLegacy, updatedEvent: BuildingLegacy): void {
    SignalArrayUtil.replaceItem(oldEvent, this._eventListSig, updatedEvent);
    this._httpEventService.storeEventList(this._eventListSig());
  }

  deleteEvent(deletedEvent: BuildingLegacy): void {
    SignalArrayUtil.deleteItem(deletedEvent, this._eventListSig);
    this._httpEventService.storeEventList(this._eventListSig());
  }
}
