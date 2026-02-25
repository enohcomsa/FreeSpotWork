import { WritableSignal } from '@angular/core';

export class SignalArrayUtil {
  static upsertBy<T, K extends keyof T>(key: K, item: T, sig: WritableSignal<T[]>) {
    sig.update(arr => {
      const i = arr.findIndex(x => x[key] === item[key]);
      return i >= 0 ? arr.map((x, idx) => (idx === i ? item : x)) : [...arr, item];
    });
  }

  static removeBy<T, K extends keyof T>(key: K, value: T[K], sig: WritableSignal<T[]>) {
    sig.update(arr => arr.filter(x => x[key] !== value));
  }


  static addItem<T>(itemToAdd: T, signalToUpdate: WritableSignal<T[]>): void {
    signalToUpdate.set(signalToUpdate() ? [...signalToUpdate(), itemToAdd] : [itemToAdd]);
  }

  static deleteItem<T>(itemToDelete: T, signalToUpdate: WritableSignal<T[]>): void {
    signalToUpdate.set(signalToUpdate().filter((item: T) => !this._deepEqual(item, itemToDelete)));
  }

  static replaceItem<T>(itemToReplace: T, signalToUpdate: WritableSignal<T[]>, newItem: T | Partial<T>): void {
    signalToUpdate.set(
      signalToUpdate().map((item: T) => (this._deepEqual(item, itemToReplace) ? { ...item, ...newItem } : item)),
    );
  }

  static editKeyOfItem<T, U extends keyof T, V>(
    itemToEdit: T,
    signalToUpdate: WritableSignal<T[]>,
    keyToUpdate: U,
    valueToUpdate: V,
  ): void {
    signalToUpdate.set(
      signalToUpdate().map((item: T) => (this._deepEqual(item, itemToEdit) ? { ...item, [keyToUpdate]: valueToUpdate } : item)),
    );
  }

  private static _deepEqual<T>(object1: T, object2: T): boolean {
    if (object1 instanceof Object && object2 instanceof Object) {
      const keys1 = Object.keys(object1);
      const keys2 = Object.keys(object2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (const key of keys1) {
        const val1 = object1[key as keyof T];
        const val2 = object2[key as keyof T];
        const areObjects = this._isObject(val1 as T) && this._isObject(val2 as T);
        if ((areObjects && !this._deepEqual(val1 as T, val2 as T)) || (!areObjects && val1 !== val2)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  private static _isObject<T>(object: T): boolean {
    return object != null && typeof object === 'object';
  }
}
