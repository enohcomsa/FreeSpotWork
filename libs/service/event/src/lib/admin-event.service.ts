import { computed, DestroyRef, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { CreateSpecialEventCmd, SpecialEvent, UpdateSpecialEventCmd } from '@free-spot-domain/event';
import { BuildingLegacy } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpEventService } from '@http-free-spot/event';
import { Observable, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AdminEventService {
  private _httpEventService: HttpEventService = inject(HttpEventService);
  private readonly _destroyRef = inject(DestroyRef);

  /** @deprecated Legacy Firebase-era state. */
  private _eventListSigLegacy: WritableSignal<BuildingLegacy[]> = signal([]);
  private _eventListSig: WritableSignal<SpecialEvent[]> = signal([]);

  /** @deprecated Legacy Firebase-era state. */
  eventListSigLegacy = this._eventListSigLegacy.asReadonly();
  eventListSig = this._eventListSig.asReadonly();

  init(): void {
    if (!this._eventListSigLegacy().length) {
      this._httpEventService
        .getEventList()
        .pipe(take(1))
        .subscribe((eventList: BuildingLegacy[]) => {
          this._eventListSigLegacy.set(eventList?.filter((event: BuildingLegacy) => event !== null));
        });
    }
    if (!this._eventListSig().length) {
      this._httpEventService
        .listSpecialEvents$()
        .pipe(take(1))
        .subscribe((specialEventList: SpecialEvent[]) => {
          this._eventListSig.set(specialEventList);
        });
    }
  }


  getSignalById(id: string): Signal<SpecialEvent> {
    return computed(() => this.eventListSig().find((event: SpecialEvent) => event.id === id) || ({} as SpecialEvent))
  }

  getById(id: string): Observable<SpecialEvent> {
    return this._httpEventService.getSpecialEventById$(id);
  }

  create(input: CreateSpecialEventCmd): void {
    this._httpEventService.createSpecialEvent$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._eventListSig));
  }

  update(id: string, patch: UpdateSpecialEventCmd): void {
    this._httpEventService.updateSpecialEvent$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._eventListSig));
  }

  remove(id: string): void {
    this._httpEventService.deleteSpecialEvent$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._eventListSig));
  }


  /** @deprecated Legacy helper based on Firebase-era state. */
  updateEventSpots(eventName: string, addingBooking: boolean): void {
    const newEventList: BuildingLegacy[] = this._eventListSigLegacy().map((event: BuildingLegacy) => {
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

    this._eventListSigLegacy.set(newEventList);
    this._httpEventService.storeEventList(this._eventListSigLegacy());
  }

  /** @deprecated Legacy helper based on Firebase-era state. */
  getEventByName(eventName: string): Signal<BuildingLegacy> {
    return computed(() => this.eventListSigLegacy().find((event: BuildingLegacy) => event.name === eventName) || ({} as BuildingLegacy));
  }

  /** @deprecated Legacy helper based on Firebase-era state. */
  addEvent(newEvent: BuildingLegacy): void {
    SignalArrayUtil.addItem(newEvent, this._eventListSigLegacy);
    this._httpEventService.storeEventList(this._eventListSigLegacy());
  }

  /** @deprecated Legacy helper based on Firebase-era state. */
  updateEvent(oldEvent: BuildingLegacy, updatedEvent: BuildingLegacy): void {
    SignalArrayUtil.replaceItem(oldEvent, this._eventListSigLegacy, updatedEvent);
    this._httpEventService.storeEventList(this._eventListSigLegacy());
  }

  /** @deprecated Legacy helper based on Firebase-era state. */
  deleteEvent(deletedEvent: BuildingLegacy): void {
    SignalArrayUtil.deleteItem(deletedEvent, this._eventListSigLegacy);
    this._httpEventService.storeEventList(this._eventListSigLegacy());
  }




}
