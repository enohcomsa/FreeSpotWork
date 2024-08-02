import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Group } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpGroupService } from '@http-free-spot/group';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGroupService {
  private _httpGroupService: HttpGroupService = inject(HttpGroupService);
  private _groupListSig: WritableSignal<Group[]> = signal([]);
  groupListSig = this._groupListSig.asReadonly();

  init(): void {
    if (!this._groupListSig().length) {
      this._httpGroupService
        .getGroupList()
        .pipe(take(1))
        .subscribe((groupList: Group[]) => {
          this._groupListSig.set(groupList?.filter((group: Group) => group !== null));
        });
    }
  }

  getGroupByName(groupName: string): Signal<Group> {
    return computed(() => this.groupListSig().find((group: Group) => group.name === groupName) || ({} as Group));
  }

  addGroup(newGroup: Group): void {
    SignalArrayUtil.addItem(newGroup, this._groupListSig);
    this._httpGroupService.storeGroupList(this._groupListSig());
  }

  updateGroup(oldGroup: Group, updatedGroup: Group): void {
    SignalArrayUtil.replaceItem(oldGroup, this._groupListSig, updatedGroup);
    this._httpGroupService.storeGroupList(this._groupListSig());
  }

  deleteGroup(deletedGroup: Group): void {
    SignalArrayUtil.deleteItem(deletedGroup, this._groupListSig);
    this._httpGroupService.storeGroupList(this._groupListSig());
  }
}
