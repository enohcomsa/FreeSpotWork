import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DynamicChipListComponent, TimetableItemComponent } from '@free-spot/ui';
import { Faculty, FreeSpotUser, Group, SemiGroup, TimetableActivityItem, TimeTableItem, Year } from '@free-spot/models';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { FormBuilder, FormsModule } from '@angular/forms';
import { AdminBuildingService } from '@free-spot-service/building';
import { AdminGroupTimetableComponent } from '../admin-group-timetable/admin-group-timetable.component';
import { AdminRoomService } from '@free-spot-service/room';
import { WeekDay } from '@free-spot/enums';
import { AdminSemisemiGroupTimetableComponent } from '../admin-semigroup-timetable/admin-semigroup-timetable.component';
import { AppDateService } from '@free-spot-service/app-date';
import { UserService } from '@free-spot-service/user';
import { BookingService } from '@free-spot-service/booking';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'free-spot-group',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicChipListComponent,
    MatTabsModule,
    TimetableItemComponent,
    AdminGroupTimetableComponent,
    MatSlideToggleModule,
    AdminSemisemiGroupTimetableComponent,
    MatTooltipModule,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _adminBuildingService: AdminBuildingService = inject(AdminBuildingService);
  private _appDateService: AppDateService = inject(AppDateService);
  private _userService: UserService = inject(UserService);
  private _bookingService: BookingService = inject(BookingService);

  groupNameSig = input.required<string>();
  groupSig: Signal<Group> = signal<Group>({} as Group);
  yearSig: Signal<Year> = signal<Year>({} as Year);
  facultySig: Signal<Faculty> = signal<Faculty>({} as Faculty);
  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;

  semigroupsEnabledSig = computed(() => !!this.groupSig().semigroups);
  addingYear = false;
  editingYear = false;
  addGroupFormControl = this._formBuilder.nonNullable.control('');

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

    this._updateFaculty(updatedGroup);
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
