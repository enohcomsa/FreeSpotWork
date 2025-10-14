import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal, signal, viewChild } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DynamicChipListComponent, TimetableItemComponent } from '@free-spot/ui';
import { Faculty, FreeSpotUser, Group, SemiGroup, TimetableActivityItem, TimeTableItem, Year } from '@free-spot/models';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { FormsModule } from '@angular/forms';
import { BuildingService } from '@free-spot-service/building';
import { AdminGroupTimetableComponent } from '../admin-group-timetable/admin-group-timetable.component';
import { AdminRoomService } from '@free-spot-service/room';
import { WeekDay } from '@free-spot/enums';
import { AdminSemisemiGroupTimetableComponent } from '../admin-semigroup-timetable/admin-semigroup-timetable.component';
import { AppDateService } from '@free-spot-service/app-date';
import { UserService } from '@free-spot-service/user';
import { BookingService } from '@free-spot-service/booking';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { delay, of } from 'rxjs';

@Component({
  selector: 'free-spot-group',

  imports: [
    FormsModule,
    DynamicChipListComponent,
    MatTabsModule,
    TimetableItemComponent,
    AdminGroupTimetableComponent,
    MatSlideToggleModule,
    AdminSemisemiGroupTimetableComponent,
    MatTooltipModule
],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent implements OnInit {
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _adminBuildingService: BuildingService = inject(BuildingService);
  private _appDateService: AppDateService = inject(AppDateService);
  private _userService: UserService = inject(UserService);
  private _bookingService: BookingService = inject(BookingService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);

  groupNameSig = input.required<string>();
  groupSig: Signal<Group> = signal<Group>({} as Group);
  yearSig: Signal<Year> = signal<Year>({} as Year);
  facultySig: Signal<Faculty> = signal<Faculty>({} as Faculty);
  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;
  deletableUserListSig: Signal<FreeSpotUser[]> = computed(() =>
    this.userListSig().filter((user: FreeSpotUser) => !this._checkUserInSemigroup(user)),
  );

  semigroupToggle = viewChild.required<MatSlideToggle>('semigroupsToggle');
  semigroupsEnabledSig = computed(() => !!this.groupSig().semigroups);
  addingYear = false;
  editingYear = false;

  emptyTimetable: Signal<TimeTableItem[]> = computed(() => [
    { weekDay: WeekDay.MONDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.MONDAY) },
    { weekDay: WeekDay.TUESDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.TUESDAY) },
    { weekDay: WeekDay.WEDNESDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.WEDNESDAY) },
    { weekDay: WeekDay.THURSDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.THURSDAY) },
    { weekDay: WeekDay.FRIDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.FRIDAY) },
  ]);

  ngOnInit(): void {
    this._adminRoomService.init();
    this._adminBuildingService.init();
    this._adminFacultyService.init();
    this._appDateService.init();
    this._userService.init();
    this._bookingService.init();

    this.groupSig = computed(() => {
      let currentGroup: Group = { name: this.groupNameSig(), studentList: [], timetable: [] };
      this.facultySig().yearList?.forEach((year: Year) =>
        year.yearGroupList?.forEach((yearGroup: Group) => {
          if (yearGroup.name === this.groupNameSig()) {
            currentGroup = yearGroup;
          }
        }),
      );
      return currentGroup;
    });

    this.yearSig = computed(() => {
      let currentYear: Year = {} as Year;
      this.facultySig().yearList?.forEach((year: Year) =>
        year.yearGroupList?.some((yearGroup: Group) => {
          if (yearGroup.name === this.groupNameSig()) {
            currentYear = year;
          }
        }),
      );
      return currentYear;
    });

    this.facultySig = this._adminFacultyService.getFacultyByGroupName(this.groupNameSig());
  }

  toggleSemigroups(enableSemigroups: boolean): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to switch semigroups? Timetable data will be lost!')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          if (enableSemigroups) {
            const groupWithSemigroups: Group = {
              ...this.groupSig(),
              timetable: this.emptyTimetable(),
              semigroups: [
                { name: this.groupNameSig() + ' sg1', students: [], timetable: this.emptyTimetable() },
                { name: this.groupNameSig() + ' sg2', students: [], timetable: this.emptyTimetable() },
              ],
            };
            this._updateFaculty(groupWithSemigroups);
          } else {
            const groupWithoutSemigroups: Group = {
              name: this.groupNameSig(),
              studentList: this.groupSig().studentList ? [...this.groupSig().studentList] : [],
              timetable: this.emptyTimetable(),
            };
            this._updateFaculty(groupWithoutSemigroups);
          }
        } else {
          this.semigroupToggle().checked = !this.semigroupToggle()?.checked;
        }
      });
  }

  updateGroupStudentList(updatedStudentGroupList: FreeSpotUser[]): void {
    const updatedGroup: Group = { ...this.groupSig(), studentList: updatedStudentGroupList };

    if (this.groupSig().studentList?.length < updatedStudentGroupList.length || this.groupSig().studentList === undefined) {
      const oldUserName: FreeSpotUser = updatedStudentGroupList.filter(
        (student: FreeSpotUser) =>
          this.groupSig().studentList?.find(
            (oldStudent: FreeSpotUser) =>
              oldStudent.firstName === student.firstName && oldStudent.familyName === student.familyName,
          ) === undefined,
      )[0];

      const oldUser: FreeSpotUser =
        this.userListSig().find(
          (user: FreeSpotUser) => user.firstName === oldUserName.firstName && user.familyName === oldUserName.familyName,
        ) || ({} as FreeSpotUser);

      const newUser: FreeSpotUser = {
        ...(oldUser as FreeSpotUser),
        bookingList: this._bookingService.generateUserBookedItems(this.groupSig(), true),
        faculty: this.facultySig().name,
        currentYear: this.yearSig().name,
        group: this.groupSig().name,
      };
      updatedGroup.timetable = updatedGroup.timetable.map((timetableItem: TimeTableItem) => {
        return {
          ...timetableItem,
          activities: timetableItem.activities?.map((timetableActivity: TimetableActivityItem) => {
            return {
              ...timetableActivity,
              freeSpots: timetableActivity.freeSpots - 1,
              busySpots: timetableActivity.busySpots + 1,
            };
          }),
        };
      });

      this._userService.updateFreeSpotUser(oldUser, newUser);
    } else {
      const oldUserName: FreeSpotUser = this.groupSig().studentList.filter(
        (student: FreeSpotUser) =>
          updatedStudentGroupList?.find(
            (oldStudent: FreeSpotUser) =>
              oldStudent.firstName === student.firstName && oldStudent.familyName === student.familyName,
          ) === undefined,
      )[0];

      const oldUser: FreeSpotUser =
        this.userListSig().find(
          (user: FreeSpotUser) => user.firstName === oldUserName.firstName && user.familyName === oldUserName.familyName,
        ) || ({} as FreeSpotUser);

      const newUser: FreeSpotUser = {
        ...oldUser,
        bookingList: this._bookingService.generateUserBookedItems(this.groupSig(), false),
        faculty: undefined,
        currentYear: undefined,
        group: undefined,
      };
      newUser.bookingList = [];

      updatedGroup.timetable = updatedGroup.timetable.map((timetableItem: TimeTableItem) => {
        return {
          ...timetableItem,
          activities: timetableItem.activities?.map((timetableActivity: TimetableActivityItem) => {
            return {
              ...timetableActivity,
              freeSpots: timetableActivity.freeSpots + 1,
              busySpots: timetableActivity.busySpots - 1,
            };
          }),
        };
      });

      this._userService.updateFreeSpotUser(oldUser, newUser);
    }

    this._updateFaculty(updatedGroup);
  }

  updateGroupTimetable(updatedTimetableGroup: Group): void {
    this._updateFaculty(updatedTimetableGroup);
  }

  updateSemiGroupStudentList(updatedStudentSemiGroupList: FreeSpotUser[], oldSemiGroup: SemiGroup): void {
    const updatedSemiGroup: SemiGroup = { ...oldSemiGroup, students: updatedStudentSemiGroupList };

    if (oldSemiGroup.students?.length < updatedStudentSemiGroupList.length || oldSemiGroup.students === undefined) {
      const oldUserName: FreeSpotUser = updatedStudentSemiGroupList.filter(
        (student: FreeSpotUser) =>
          oldSemiGroup.students?.find(
            (oldStudent: FreeSpotUser) =>
              oldStudent.firstName === student.firstName && oldStudent.familyName === student.familyName,
          ) === undefined,
      )[0];

      const oldUser: FreeSpotUser =
        this.userListSig().find(
          (user: FreeSpotUser) => user.firstName === oldUserName.firstName && user.familyName === oldUserName.familyName,
        ) || ({} as FreeSpotUser);

      const newUser: FreeSpotUser = {
        ...(oldUser as FreeSpotUser),
        bookingList: this._bookingService.generateUserBookedItems(this.groupSig(), true, oldSemiGroup),
        faculty: this.facultySig().name,
        currentYear: this.yearSig().name,
        group: this.groupSig().name,
        semiGroup: oldSemiGroup.name,
      };

      updatedSemiGroup.timetable = updatedSemiGroup.timetable.map((timetableItem: TimeTableItem) => {
        return {
          ...timetableItem,
          activities: timetableItem.activities?.map((timetableActivity: TimetableActivityItem) => {
            return {
              ...timetableActivity,
              freeSpots: timetableActivity.freeSpots - 1,
              busySpots: timetableActivity.busySpots + 1,
            };
          }),
        };
      });

      this._userService.updateFreeSpotUser(oldUser, newUser);
    } else {
      const oldUserName: FreeSpotUser = oldSemiGroup.students.filter(
        (student: FreeSpotUser) =>
          updatedStudentSemiGroupList?.find(
            (oldStudent: FreeSpotUser) =>
              oldStudent.firstName === student.firstName && oldStudent.familyName === student.familyName,
          ) === undefined,
      )[0];

      const oldUser: FreeSpotUser =
        this.userListSig().find(
          (user: FreeSpotUser) => user.firstName === oldUserName.firstName && user.familyName === oldUserName.familyName,
        ) || ({} as FreeSpotUser);

      const newUser: FreeSpotUser = {
        ...oldUser,
        bookingList: this._bookingService.generateUserBookedItems(this.groupSig(), false, oldSemiGroup),
        faculty: undefined,
        currentYear: undefined,
        group: undefined,
        semiGroup: undefined,
      };
      newUser.bookingList = [];
      updatedSemiGroup.timetable = updatedSemiGroup.timetable.map((timetableItem: TimeTableItem) => {
        return {
          ...timetableItem,
          activities: timetableItem.activities?.map((timetableActivity: TimetableActivityItem) => {
            return {
              ...timetableActivity,
              freeSpots: timetableActivity.freeSpots + 1,
              busySpots: timetableActivity.busySpots - 1,
            };
          }),
        };
      });
      this._userService.updateFreeSpotUser(oldUser, newUser);
    }

    const updatedGroup: Group = {
      ...this.groupSig(),
      semigroups: this.groupSig().semigroups?.map((semiGroup: SemiGroup) =>
        semiGroup.name === updatedSemiGroup.name ? updatedSemiGroup : semiGroup,
      ),
    };

    of(null)
      .pipe(delay(1500))
      .subscribe(() => {
        this._updateFaculty(updatedGroup);
      });
  }

  updateSemiGroupTimetable(updatedSemiGroup: SemiGroup): void {
    const updatedGroup: Group = {
      ...this.groupSig(),
      semigroups: this.groupSig().semigroups?.map((semiGroup: SemiGroup) =>
        semiGroup.name === updatedSemiGroup.name ? updatedSemiGroup : semiGroup,
      ),
    };

    this._updateFaculty(updatedGroup);
  }

  private _checkUserInSemigroup(user: FreeSpotUser): boolean {
    if (this.groupSig().semigroups === undefined || this.groupSig().semigroups === null) {
      return false;
    } else {
      return (
        this.groupSig()
          .semigroups?.map((semigroup: SemiGroup) =>
            semigroup.students?.some(
              (student: FreeSpotUser) => student.firstName === user.firstName && student.familyName === user.familyName,
            ),
          )
          ?.some((check: boolean) => check) || false
      );
    }
  }

  private _updateFaculty(updatedGroup: Group): void {
    const updatedYear: Year = {
      ...this.yearSig(),
      yearGroupList: this.yearSig().yearGroupList.map((yearGroup: Group) =>
        yearGroup.name === updatedGroup.name ? updatedGroup : yearGroup,
      ),
    };

    const updatedFaculty: Faculty = {
      ...this.facultySig(),
      yearList: this.facultySig().yearList?.map((year: Year) => (year.name === updatedYear.name ? updatedYear : year)),
    };
    this._adminFacultyService.updateFaculty(this.facultySig(), updatedFaculty);
  }
}
