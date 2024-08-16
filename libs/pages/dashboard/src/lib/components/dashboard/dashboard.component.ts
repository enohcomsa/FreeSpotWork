import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '@free-spot/ui';
import { BuildingCardComponent } from '../building-card/building-card.component';
import { AdminBuildingService } from '@free-spot-service/building';
import {
  Building,
  Faculty,
  Floor,
  FreeSpotDate,
  FreeSpotUser,
  Group,
  Room,
  SemiGroup,
  TimetableActivityItem,
  TimeTableItem,
  Year,
} from '@free-spot/models';
import { UserService } from '@free-spot-service/user';
import { toObservable } from '@angular/core/rxjs-interop';
import { delay, filter, of, Subscription, switchMap, take } from 'rxjs';
import { UserSetupDialogComponent } from '../user-setup-dialog/user-setup-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { AppDateService } from '@free-spot-service/app-date';
import { AdminFloorService } from '@free-spot-service/floor';
import { AdminRoomService } from '@free-spot-service/room';
import { BookingService } from '@free-spot-service/booking';
import { AdminEventService } from '@free-spot-service/event';

@Component({
  selector: 'free-spot-dashboard',
  standalone: true,
  imports: [CommonModule, BuildingCardComponent, DynamicFormComponent, UserSetupDialogComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private _dialog: MatDialog = inject(MatDialog);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  private _adminBuildingService: AdminBuildingService = inject(AdminBuildingService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _userService: UserService = inject(UserService);
  private _appDateService: AppDateService = inject(AppDateService);
  private _bookingService: BookingService = inject(BookingService);
  private _adminEventService: AdminEventService = inject(AdminEventService);

  roomListSig: Signal<Room[]> = this._adminRoomService.roomListSig;
  facultyListSig: Signal<Faculty[]> = this._adminFacultyService.facultyListSig;
  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;
  dateChangedSig: WritableSignal<boolean> = this._appDateService.appDateChanged;
  appDateSig: Signal<FreeSpotDate> = this._appDateService.appDateSig;
  buildingListSig: Signal<Building[]> = this._adminBuildingService.buildingListSig;
  eventListSig: Signal<Building[]> = computed(() =>
    this._adminEventService
      .eventListSig()
      .sort((event1, event2) => new Date(event1.date as Date).getTime() - new Date(event2.date as Date).getTime())
      .filter((event: Building) => new Date().getTime() - new Date(event.date as Date).getTime() <= 0),
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
        this.roomListSig().forEach((room: Room) => {
          const updatedRoom: Room = {
            ...room,
            timetable: room.timetable.map((timetableItem: TimeTableItem) => this._updateTimetableItem(timetableItem)),
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
                    timetable: group.timetable.map((timetableItem: TimeTableItem) => this._updateTimetableItem(timetableItem)),
                    semigroups: group.semigroups?.map((semiGroup: SemiGroup) => {
                      return {
                        ...semiGroup,
                        timetable: semiGroup.timetable.map((timetableItem: TimeTableItem) =>
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
    .subscribe((user: FreeSpotUser) => {
      if ((!user.group && !user.semiGroup) || !user.faculty || !user.currentYear) {
        this._dialog.open(UserSetupDialogComponent, {
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

  private _updateFloorAndBuilding(updatedRoom: Room): void {
    const oldFloor: Floor = this._adminFloorService.getFloorByName(updatedRoom.floorName)();
    const updatedFloor: Floor = {
      ...oldFloor,
      roomList: oldFloor.roomList.map((room: Room) => (room.name === updatedRoom.name ? updatedRoom : room)),
    };
    this._adminFloorService.updateFloor(oldFloor, updatedFloor);
    this._updateBuilding(updatedFloor);
  }

  private _updateBuilding(changedFloor: Floor): void {
    const oldBuilding: Building = this._adminBuildingService.getBuildingByName(changedFloor.buildingName)();
    const updatedBuilding: Building = {
      ...oldBuilding,
      floorList: oldBuilding.floorList.map((floor: Floor) => (floor.name === changedFloor.name ? changedFloor : floor)),
    };
    this._adminBuildingService.updateBuilding(oldBuilding, updatedBuilding);
  }

  private _updateTimetableItem(oldTimetableItem: TimeTableItem): TimeTableItem {
    return {
      ...oldTimetableItem,
      date: this._appDateService.getAppDateByWeekDay(oldTimetableItem.weekDay),
      activities: oldTimetableItem.activities?.map((timetableActivity: TimetableActivityItem) => {
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
