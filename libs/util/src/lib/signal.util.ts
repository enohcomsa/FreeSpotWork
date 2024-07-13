import { WritableSignal } from '@angular/core';

export class SignalUtil {
  static updateSignal<T>(itemToAdd: T, signalToUpdate: WritableSignal<T[]>): void {
    signalToUpdate.set([...signalToUpdate(), itemToAdd]);
  }

  private static _isObject<T>(object: T): boolean {
    return object != null && typeof object === 'object';
  }
}
