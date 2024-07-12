import { WritableSignal } from '@angular/core';

export class SubjectArray {
  static addItem<T>(itemToAdd: T, signalToUpdate: WritableSignal<T[]>): void {
    signalToUpdate.set([...signalToUpdate(), itemToAdd]);
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

  //   private _generatePartialItem<T>(form: FormGroup): Partial<T> {
  //     let newPartialItem: Partial<T> = {};
  //     Object.keys(form.controls).forEach((key: string) => {
  //       newPartialItem = { ...newPartialItem, [key]: form.get(key)?.value };
  //     });
  //     return newPartialItem;
  //   }
}

//
//
//
//
//
//
//
//
//
//

// interface Room {
//   name: string;
//   subjectList: string[];
//   totalSpots: number;
//   freeSpots: number;
//   busySpots: number;
//   unavaibileSpots: number;
// }
//   roomArr: Room[] = [
//     this.createRoom(1, 30, 5),
//     this.createRoom(2, 40, 2),
//     this.createRoom(3, 20, 4),
//     this.createRoom(4, 25, 3),
//     this.createRoom(5, 35, 10),
//     this.createRoom(6, 100, 20)]

//   roomSig: WritableSignal<Room[]> = signal(this.roomArr);

//   roomFormGroup = this._formBuilder.group({
//     name: ['room_678'],
//     totalSpots: 10,
//     subjectList: [['ddd', 'eee', 'fff']],
//   });
//   name = this._formBuilder.control('');

// console.log(this.roomSig());
// this.addItem(this.createRoom(111, 10, 0), this.roomSig);
// console.log(this.roomSig());
// this.deleteItem(this.createRoom(1, 30, 5), this.roomSig);
// console.log(this.roomSig());
// this.replaceItem(this.createRoom(2, 40, 2), this.roomSig, this.createRoom(2222, 10, 10),);
// console.log(this.roomSig());

// this.editKeyOfItem(this.createRoom(3, 20, 4), this.roomSig, 'totalSpots' as keyof Room, 10);
// console.log(this.roomSig());

// this.replaceItem(this.createRoom(4, 25, 3), this.roomSig, this._generatePartialItem<Room>(this.roomFormGroup));
// console.log(this.roomSig());

//   createRoom(roomIndex: number, totalSpots: number, unavaibileSpots: number): Room {
//     return {
//       name: 'room_' + roomIndex,
//       subjectList: ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff'],
//       totalSpots: totalSpots,
//       freeSpots: totalSpots - unavaibileSpots,
//       busySpots: 0,
//       unavaibileSpots: unavaibileSpots

//     }
//   }
