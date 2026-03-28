import { computed, DestroyRef, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { CreateSpecialEventCmd, SpecialEvent, UpdateSpecialEventCmd } from '@free-spot-domain/event';
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

  private _eventListSig: WritableSignal<SpecialEvent[]> = signal([]);

  eventListSig = this._eventListSig.asReadonly();

  init(): void {
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
}
