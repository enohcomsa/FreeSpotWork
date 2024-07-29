import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { BookedEvent, FreeSpotUser } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpUserService } from '@http-free-spot/user';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _httpFreeSpotUserService: HttpUserService = inject(HttpUserService);

  private _userListSig: WritableSignal<FreeSpotUser[]> = signal([]);
  userListSig = this._userListSig.asReadonly();

  init(): void {
    this._httpFreeSpotUserService
      .getUserList()
      .pipe(take(1))
      .subscribe((userList: FreeSpotUser[]) => {
        this._userListSig.set(userList?.filter((user: FreeSpotUser) => user !== null));
      });
  }

  getFreeSpotUserByEmail(userEmail: string): Signal<FreeSpotUser> {
    return computed(() => this._userListSig()?.find((user: FreeSpotUser) => user.email === userEmail) || ({} as FreeSpotUser));
  }

  removeTimetableActivitiesByRoomName(deletedRoomName: string): void {
    const newUserList: FreeSpotUser[] = this._userListSig().map((user: FreeSpotUser) => {
      return { ...user, bookingList: user.bookingList?.filter((booking: BookedEvent) => booking.roomName !== deletedRoomName) };
    });
    this._userListSig.set(newUserList);
    this._httpFreeSpotUserService.storeUserList(this._userListSig());
  }

  addFreeSpotUser(newFreeSpotUser: FreeSpotUser): void {
    SignalArrayUtil.addItem(newFreeSpotUser, this._userListSig);
    this._httpFreeSpotUserService.storeUserList(this._userListSig());
  }

  updateFreeSpotUser(oldFreeSpotUser: FreeSpotUser, updatedFreeSpotUser: FreeSpotUser): void {
    SignalArrayUtil.replaceItem(oldFreeSpotUser, this._userListSig, updatedFreeSpotUser);
    this._httpFreeSpotUserService.storeUserList(this._userListSig());
  }

  deleteFreeSpotUser(deletedFreeSpotUser: FreeSpotUser): void {
    SignalArrayUtil.deleteItem(deletedFreeSpotUser, this._userListSig);
    this._httpFreeSpotUserService.storeUserList(this._userListSig());
  }
}
