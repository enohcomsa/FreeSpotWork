import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Building } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpEventService } from '@http-free-spot/event';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminEventService {
  private _httpEventService: HttpEventService = inject(HttpEventService);
  private _eventListSig: WritableSignal<Building[]> = signal([]);
  eventListSig = this._eventListSig.asReadonly();

  init(): void {
    if (!this._eventListSig().length) {
      this._httpEventService
        .getEventList()
        .pipe(take(1))
        .subscribe((eventList: Building[]) => {
          this._eventListSig.set(eventList?.filter((event: Building) => event !== null));
        });
    }
  }

  getEventByName(eventName: string): Signal<Building> {
    return computed(() => this.eventListSig().find((event: Building) => event.name === eventName) || ({} as Building));
  }

  addEvent(newEvent: Building): void {
    SignalArrayUtil.addItem(newEvent, this._eventListSig);
    this._httpEventService.storeEventList(this._eventListSig());
  }

  updateEvent(oldEvent: Building, updatedEvent: Building): void {
    SignalArrayUtil.replaceItem(oldEvent, this._eventListSig, updatedEvent);
    this._httpEventService.storeEventList(this._eventListSig());
  }

  deleteEvent(deletedEvent: Building): void {
    SignalArrayUtil.deleteItem(deletedEvent, this._eventListSig);
    this._httpEventService.storeEventList(this._eventListSig());
  }
}
