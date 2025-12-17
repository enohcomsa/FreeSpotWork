import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal, WritableSignal } from '@angular/core';

import { DynamicFormComponent } from '@free-spot/ui';
import { BuildingCardComponent } from '../building-card/building-card.component';
import { BuildingService } from '@free-spot-service/building';
import {
  BuildingLegacy,
  Faculty,
  FloorLegacy,
  FreeSpotDate,
  FreeSpotUser,
  Group,
  RoomLegacy,
  SemiGroup,
  TimetableActivityItemLegacy,
  TimeTableItemLecagy,
  Year,
} from '@free-spot/models';
import { UserService } from '@free-spot-service/user';
import { toObservable } from '@angular/core/rxjs-interop';
import { delay, filter, of, Subscription, switchMap, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { AppDateService } from '@free-spot-service/app-date';
import { AdminFloorService } from '@free-spot-service/floor';
import { AdminRoomService } from '@free-spot-service/room';
import { BookingService } from '@free-spot-service/booking';
import { AdminEventService } from '@free-spot-service/event';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-spot-dashboard',

  imports: [BuildingCardComponent, DynamicFormComponent, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private _dialog: MatDialog = inject(MatDialog);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  private _adminBuildingService: BuildingService = inject(BuildingService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _userService: UserService = inject(UserService);
  private _appDateService: AppDateService = inject(AppDateService);
  private _bookingService: BookingService = inject(BookingService);
  private _adminEventService: AdminEventService = inject(AdminEventService);

  roomListSig: Signal<RoomLegacy[]> = this._adminRoomService.roomListSigLegacy;
  facultyListSig: Signal<Faculty[]> = this._adminFacultyService.facultyListSig;
  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;
  dateChangedSig: WritableSignal<boolean> = this._appDateService.appDateChanged;
  appDateSig: Signal<FreeSpotDate> = this._appDateService.appDateSig;
  buildingListSig: Signal<BuildingLegacy[]> = this._adminBuildingService.buildingListSigLegacy;
  eventListSig: Signal<BuildingLegacy[]> = computed(() =>
    this._adminEventService
      .eventListSig()
      .sort((event1, event2) => new Date(event1.date as Date).getTime() - new Date(event2.date as Date).getTime())
      .filter((event: BuildingLegacy) => new Date().getTime() - new Date(event.date as Date).getTime() <= 0),
  );
  currentUserGroupSig: Signal<Group> = computed(() =>
    this._adminFacultyService.getGroupByName(this.currentUserSig().group as string)(),
  );

  appDateChangeSubscription: Subscription = toObservable(this.dateChangedSig)
    .pipe(
      filter((dateChanged) => !!dateChanged),
      take(1),
      delay(1200),
      switchMap(() => {
        this.roomListSig().forEach((room: RoomLegacy) => {
          const updatedRoom: RoomLegacy = {
            ...room,
            timetable: room.timetable.map((timetableItem: TimeTableItemLecagy) => this._updateTimetableItem(timetableItem)),
          };

          this._adminRoomService.updateRoom(room, updatedRoom);
          this._updateFloorAndBuilding(updatedRoom);
        });
        this.facultyListSig().forEach((faculty: Faculty) => {
          const updatedFaculty: Faculty = {
            ...faculty,
            yearList: faculty.yearList?.map((year: Year) => {
              return {
                ...year,
                yearGroupList: year.yearGroupList?.map((group: Group) => {
                  return {
                    ...group,
                    timetable: group.timetable.map((timetableItem: TimeTableItemLecagy) => this._updateTimetableItem(timetableItem)),
                    semigroups: group.semigroups?.map((semiGroup: SemiGroup) => {
                      return {
                        ...semiGroup,
                        timetable: semiGroup.timetable.map((timetableItem: TimeTableItemLecagy) =>
                          this._updateTimetableItem(timetableItem),
                        ),
                      };
                    }),
                  };
                }),
              };
            }),
          };

          this._adminFacultyService.updateFaculty(faculty, updatedFaculty);
        });

        return of(true).pipe(delay(1200));
      }),
    )
    .subscribe(() => {
      this.userListSig().forEach((user: FreeSpotUser) => {
        const updatedUser: FreeSpotUser = {
          ...user,
          bookingList: this._bookingService.generateUserBookedItems(
            this._adminFacultyService.getGroupByName(user.group as string)(),
            true,
            this._getUserSemigroup(user.semiGroup as string, this._adminFacultyService.getGroupByName(user.group as string)()),
          ),
        };

        this._userService.updateFreeSpotUser(user, updatedUser);
      });
    });

  currentUserEmail = (
    JSON.parse(localStorage.getItem('user') as string) as {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    }
  ).email;
  currentUserSig: Signal<FreeSpotUser> = this._userService.getFreeSpotUserByEmail(this.currentUserEmail);
  currentUserSubscription: Subscription = toObservable(this.currentUserSig)
    .pipe(
      filter((user: FreeSpotUser) => Object.keys(user).length !== 0),
      take(1),
    )
    .subscribe(async (user: FreeSpotUser) => {
      if ((!user.group && !user.semiGroup) || !user.faculty || !user.currentYear) {
        this._dialog.open(
          await import('../user-setup-dialog/user-setup-dialog.component').then(
            (m) => m.UserSetupDialogComponent
          ), {
          delayFocusTrap: true,
          disableClose: true,
          panelClass: ['w-full', 'sm:w-3/5', 'md:w-1/2'],
          data: this.currentUserSig(),
        });
      }
    });

  ngOnInit(): void {
    this._userService.init();
    this._adminRoomService.init();
    this._adminFloorService.init();
    this._adminBuildingService.init();
    this._adminFacultyService.init();
    this._appDateService.init();
    this._bookingService.init();
    this._adminEventService.init();
  }

  private _updateFloorAndBuilding(updatedRoom: RoomLegacy): void {
    const oldFloor: FloorLegacy = this._adminFloorService.getFloorByName(updatedRoom.floorName)();
    const updatedFloor: FloorLegacy = {
      ...oldFloor,
      roomList: oldFloor.roomList.map((room: RoomLegacy) => (room.name === updatedRoom.name ? updatedRoom : room)),
    };
    this._adminFloorService.updateFloor(oldFloor, updatedFloor);
    this._updateBuilding(updatedFloor);
  }

  private _updateBuilding(changedFloor: FloorLegacy): void {
    const oldBuilding: BuildingLegacy = this._adminBuildingService.getBuildingByName(changedFloor.buildingName)();
    const updatedBuilding: BuildingLegacy = {
      ...oldBuilding,
      floorList: oldBuilding.floorList.map((floor: FloorLegacy) => (floor.name === changedFloor.name ? changedFloor : floor)),
    };
    this._adminBuildingService.updateBuilding(oldBuilding, updatedBuilding);
  }

  private _updateTimetableItem(oldTimetableItem: TimeTableItemLecagy): TimeTableItemLecagy {
    return {
      ...oldTimetableItem,
      date: this._appDateService.getAppDateByWeekDay(oldTimetableItem.weekDay),
      activities: oldTimetableItem.activities?.map((timetableActivity: TimetableActivityItemLegacy) => {
        return {
          ...timetableActivity,
          freeSpots: timetableActivity.freeSpots + timetableActivity.busySpots,
          busySpots: 0,
          date: this._appDateService.getAppDateByWeekDay(oldTimetableItem.weekDay),
        };
      }),
    };
  }

  private _getUserSemigroup(semiGroupName: string, userGroup: Group): SemiGroup {
    return userGroup.semigroups?.find((semiGroup: SemiGroup) => semiGroup.name === semiGroupName) || ({} as SemiGroup);
  }
}
