import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal, viewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DynamicChipListComponent, TimetableItemComponent } from '@free-spot/ui';
import { FreeSpotUser } from '@free-spot/models';
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
import { CohortService } from '@free-spot-service/cohort';
import { Cohort, CreateCohortCmd } from '@free-spot-domain/cohort';
import { CohortTypeDTO } from '@free-spot/api-client';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';
import { _ } from '@ngx-translate/core';
import { ProgramYearService } from '@free-spot-service/program-year';
import { ProgramService } from '@free-spot-service/program';
import { TimetableActivity } from '@free-spot-domain/timetable-activity';
import { TimetableActivityCardVM } from '@free-spot-presentation/timetable-activity-card';
import { SubjectService } from '@free-spot-service/subject';

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
  private _adminCohortService: CohortService = inject(CohortService);
  private _adminTimetableActivityService: AdminTimetableActivityService = inject(AdminTimetableActivityService);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _adminBuildingService: BuildingService = inject(BuildingService);
  private _appDateService: AppDateService = inject(AppDateService);
  private _userService: UserService = inject(UserService);
  private _bookingService: BookingService = inject(BookingService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _adminProgramYearService: ProgramYearService = inject(ProgramYearService);
  private _adminProgramService: ProgramService = inject(ProgramService);
  private _adminSubjectService: SubjectService = inject(SubjectService);

  readonly facultySubjectListSig = computed(() => {
    const programYearId = this._adminProgramYearService.getSignalById(this.groupSig().programYearId)().programId;
    const facultyId = this._adminProgramService.getSignalById(programYearId)().facultyId;
    return this._adminFacultyService.getSignalById(facultyId)().subjectList
  });

  groupIdSig = input.required<string>();
  readonly groupSig = computed(() => this._adminCohortService.getSignalById(this.groupIdSig())());
  readonly semigroupListSig = computed(() => this._adminCohortService.selectSemigroupByparentGroupId(this.groupIdSig())());
  semiGroup1IdSig = computed(() => this.semigroupListSig()[0].id);//check to ensure first vs sconde semigroup
  semiGroup2IdSig = computed(() => this.semigroupListSig()[1].id);

  readonly workWeek: WeekDay[] = [
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
  ];

  readonly groupTimetableActivityCardVMs = this._cardVMsByCohortId(this.groupIdSig);
  readonly semigroup1TimetableActivityCardVMs = this._cardVMsByCohortId(this.semiGroup1IdSig);
  readonly semigroup2TimetableActivityCardVMs = this._cardVMsByCohortId(this.semiGroup2IdSig);

  readonly timetableGroupPerDay = this._perDay(this.groupTimetableActivityCardVMs);
  readonly timetableSemigroup1PerDay = this._perDay(this.semigroup1TimetableActivityCardVMs);
  readonly timetableSemigroup2PerDay = this._perDay(this.semigroup2TimetableActivityCardVMs);

  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;
  // deletableUserListSig: Signal<FreeSpotUser[]> = computed(() =>
  //   this.userListSig().filter((user: FreeSpotUser) => !this._checkUserInSemigroup(user)),
  // );

  semigroupToggle = viewChild.required<MatSlideToggle>('semigroupsToggle');
  semigroupsEnabledSig = computed(() => !!this.semigroupListSig().length);

  ngOnInit(): void {
    this._adminRoomService.init();
    this._adminBuildingService.init();
    this._adminFacultyService.init();
    this._appDateService.init();
    this._userService.init();
    this._bookingService.init();
    this._adminCohortService.init();
    this._adminTimetableActivityService.init();
    this._adminProgramYearService.init();
    this._adminProgramService.init();
    this._adminSubjectService.init();
  }

  toggleSemigroups(enableSemigroups: boolean): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to switch semigroups? Timetable data will be lost!')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          if (enableSemigroups) {
            this._adminTimetableActivityService.removeCohortFromAllActivities(this.groupIdSig());

            const newSemigroup1: CreateCohortCmd = {
              type: CohortTypeDTO.SEMIGROUP,
              programYearId: this.groupSig().programYearId,
              name: `${this.groupSig().name} sg1`,
              parentGroupId: this.groupIdSig()
            }

            const newSemigroup2: CreateCohortCmd = {
              type: CohortTypeDTO.SEMIGROUP,
              programYearId: this.groupSig().programYearId,
              name: `${this.groupSig().name} sg2`,
              parentGroupId: this.groupIdSig()
            }

            this._adminCohortService.create(newSemigroup1);
            this._adminCohortService.create(newSemigroup2);

          } else {
            this.semigroupListSig().forEach((semiGroup: Cohort) => {
              this._adminTimetableActivityService.removeCohortFromAllActivities(semiGroup.id);
              this._adminCohortService.remove(semiGroup.id);
            });
          }
        } else {
          this.semigroupToggle().checked = !this.semigroupToggle()?.checked;
        }
      });
  }

  private _roomNameById(roomId: string): string {
    return this._adminRoomService.getSignalById(roomId)()?.name ?? '';
  }

  private _subjectShortNameById(subjectId: string): string {
    return this._adminSubjectService.getSignalById(subjectId)()?.shortName ?? '';
  }

  private _toCardVM = (timetableActivity: TimetableActivity): TimetableActivityCardVM => ({
    id: timetableActivity.id,
    weekDay: timetableActivity.weekDay,
    startHour: timetableActivity.startHour,
    endHour: timetableActivity.endHour,
    weekParity: timetableActivity.weekParity,
    activityType: timetableActivity.activityType,
    roomName: this._roomNameById(timetableActivity.roomId),
    subjectItemShortName: this._subjectShortNameById(timetableActivity.subjectId),
  });

  private _activitiesByCohortId(cohortIdSig: Signal<string | null>): Signal<TimetableActivity[]> {
    return computed(() => {
      const cohortId = cohortIdSig();
      return cohortId
        ? this._adminTimetableActivityService.selectTimetableActivityListSignalByCohortId(cohortId)()
        : [];
    });
  }

  private _cardVMsByCohortId(cohortIdSig: Signal<string | null>): Signal<TimetableActivityCardVM[]> {
    const activitiesSig = this._activitiesByCohortId(cohortIdSig);
    return computed(() => activitiesSig().map(this._toCardVM));
  }

  private _perDay(cardVMsSig: Signal<TimetableActivityCardVM[]>) {
    return computed(() => {
      const all = cardVMsSig() ?? [];
      return this.workWeek.map(day => ({
        day,
        activities: all.filter(a => a.weekDay === day),
      }));
    });
  }

  // updateGroupStudentList(updatedStudentGroupList: FreeSpotUser[]): void {
  //   const updatedGroup: GroupLegacy = { ...this.groupSigLEgacy(), studentList: updatedStudentGroupList };

  //   if (this.groupSigLEgacy().studentList?.length < updatedStudentGroupList.length || this.groupSigLEgacy().studentList === undefined) {
  //     const oldUserName: FreeSpotUser = updatedStudentGroupList.filter(
  //       (student: FreeSpotUser) =>
  //         this.groupSigLEgacy().studentList?.find(
  //           (oldStudent: FreeSpotUser) =>
  //             oldStudent.firstName === student.firstName && oldStudent.familyName === student.familyName,
  //         ) === undefined,
  //     )[0];

  //     const oldUser: FreeSpotUser =
  //       this.userListSig().find(
  //         (user: FreeSpotUser) => user.firstName === oldUserName.firstName && user.familyName === oldUserName.familyName,
  //       ) || ({} as FreeSpotUser);

  //     const newUser: FreeSpotUser = {
  //       ...(oldUser as FreeSpotUser),
  //       bookingList: this._bookingService.generateUserBookedItems(this.groupSigLEgacy(), true),
  //       faculty: this.facultySig().name,
  //       currentYear: this.yearSig().name,
  //       group: this.groupSigLEgacy().name,
  //     };
  //     updatedGroup.timetable = updatedGroup.timetable.map((timetableItem: TimeTableItemLecagy) => {
  //       return {
  //         ...timetableItem,
  //         activities: timetableItem.activities?.map((timetableActivity: TimetableActivityItemLegacy) => {
  //           return {
  //             ...timetableActivity,
  //             freeSpots: timetableActivity.freeSpots - 1,
  //             busySpots: timetableActivity.busySpots + 1,
  //           };
  //         }),
  //       };
  //     });

  //     this._userService.updateFreeSpotUser(oldUser, newUser);
  //   } else {
  //     const oldUserName: FreeSpotUser = this.groupSigLEgacy().studentList.filter(
  //       (student: FreeSpotUser) =>
  //         updatedStudentGroupList?.find(
  //           (oldStudent: FreeSpotUser) =>
  //             oldStudent.firstName === student.firstName && oldStudent.familyName === student.familyName,
  //         ) === undefined,
  //     )[0];

  //     const oldUser: FreeSpotUser =
  //       this.userListSig().find(
  //         (user: FreeSpotUser) => user.firstName === oldUserName.firstName && user.familyName === oldUserName.familyName,
  //       ) || ({} as FreeSpotUser);

  //     const newUser: FreeSpotUser = {
  //       ...oldUser,
  //       bookingList: this._bookingService.generateUserBookedItems(this.groupSigLEgacy(), false),
  //       faculty: undefined,
  //       currentYear: undefined,
  //       group: undefined,
  //     };
  //     newUser.bookingList = [];

  //     updatedGroup.timetable = updatedGroup.timetable.map((timetableItem: TimeTableItemLecagy) => {
  //       return {
  //         ...timetableItem,
  //         activities: timetableItem.activities?.map((timetableActivity: TimetableActivityItemLegacy) => {
  //           return {
  //             ...timetableActivity,
  //             freeSpots: timetableActivity.freeSpots + 1,
  //             busySpots: timetableActivity.busySpots - 1,
  //           };
  //         }),
  //       };
  //     });

  //     this._userService.updateFreeSpotUser(oldUser, newUser);
  //   }

  //   this._updateFaculty(updatedGroup);
  // }


  // updateSemiGroupStudentList(updatedStudentSemiGroupList: FreeSpotUser[], oldSemiGroup: SemiGroup): void {
  //   const updatedSemiGroup: SemiGroup = { ...oldSemiGroup, students: updatedStudentSemiGroupList };

  //   if (oldSemiGroup.students?.length < updatedStudentSemiGroupList.length || oldSemiGroup.students === undefined) {
  //     const oldUserName: FreeSpotUser = updatedStudentSemiGroupList.filter(
  //       (student: FreeSpotUser) =>
  //         oldSemiGroup.students?.find(
  //           (oldStudent: FreeSpotUser) =>
  //             oldStudent.firstName === student.firstName && oldStudent.familyName === student.familyName,
  //         ) === undefined,
  //     )[0];

  //     const oldUser: FreeSpotUser =
  //       this.userListSig().find(
  //         (user: FreeSpotUser) => user.firstName === oldUserName.firstName && user.familyName === oldUserName.familyName,
  //       ) || ({} as FreeSpotUser);

  //     const newUser: FreeSpotUser = {
  //       ...(oldUser as FreeSpotUser),
  //       bookingList: this._bookingService.generateUserBookedItems(this.groupSigLEgacy(), true, oldSemiGroup),
  //       faculty: this.facultySig().name,
  //       currentYear: this.yearSig().name,
  //       group: this.groupSigLEgacy().name,
  //       semiGroup: oldSemiGroup.name,
  //     };

  //     updatedSemiGroup.timetable = updatedSemiGroup.timetable.map((timetableItem: TimeTableItemLecagy) => {
  //       return {
  //         ...timetableItem,
  //         activities: timetableItem.activities?.map((timetableActivity: TimetableActivityItemLegacy) => {
  //           return {
  //             ...timetableActivity,
  //             freeSpots: timetableActivity.freeSpots - 1,
  //             busySpots: timetableActivity.busySpots + 1,
  //           };
  //         }),
  //       };
  //     });

  //     this._userService.updateFreeSpotUser(oldUser, newUser);
  //   } else {
  //     const oldUserName: FreeSpotUser = oldSemiGroup.students.filter(
  //       (student: FreeSpotUser) =>
  //         updatedStudentSemiGroupList?.find(
  //           (oldStudent: FreeSpotUser) =>
  //             oldStudent.firstName === student.firstName && oldStudent.familyName === student.familyName,
  //         ) === undefined,
  //     )[0];

  //     const oldUser: FreeSpotUser =
  //       this.userListSig().find(
  //         (user: FreeSpotUser) => user.firstName === oldUserName.firstName && user.familyName === oldUserName.familyName,
  //       ) || ({} as FreeSpotUser);

  //     const newUser: FreeSpotUser = {
  //       ...oldUser,
  //       bookingList: this._bookingService.generateUserBookedItems(this.groupSigLEgacy(), false, oldSemiGroup),
  //       faculty: undefined,
  //       currentYear: undefined,
  //       group: undefined,
  //       semiGroup: undefined,
  //     };
  //     newUser.bookingList = [];
  //     updatedSemiGroup.timetable = updatedSemiGroup.timetable.map((timetableItem: TimeTableItemLecagy) => {
  //       return {
  //         ...timetableItem,
  //         activities: timetableItem.activities?.map((timetableActivity: TimetableActivityItemLegacy) => {
  //           return {
  //             ...timetableActivity,
  //             freeSpots: timetableActivity.freeSpots + 1,
  //             busySpots: timetableActivity.busySpots - 1,
  //           };
  //         }),
  //       };
  //     });
  //     this._userService.updateFreeSpotUser(oldUser, newUser);
  //   }

  //   const updatedGroup: GroupLegacy = {
  //     ...this.groupSigLEgacy(),
  //     semigroups: this.groupSigLEgacy().semigroups?.map((semiGroup: SemiGroup) =>
  //       semiGroup.name === updatedSemiGroup.name ? updatedSemiGroup : semiGroup,
  //     ),
  //   };

  //   of(null)
  //     .pipe(delay(1500))
  //     .subscribe(() => {
  //       this._updateFaculty(updatedGroup);
  //     });
  // }

  // updateSemiGroupTimetable(updatedSemiGroup: SemiGroup): void {
  //   const updatedGroup: GroupLegacy = {
  //     ...this.groupSigLEgacy(),
  //     semigroups: this.groupSigLEgacy().semigroups?.map((semiGroup: SemiGroup) =>
  //       semiGroup.name === updatedSemiGroup.name ? updatedSemiGroup : semiGroup,
  //     ),
  //   };

  //   this._updateFaculty(updatedGroup);
  // }

  // private _checkUserInSemigroup(user: FreeSpotUser): boolean {
  //   if (this.groupSigLEgacy().semigroups === undefined || this.groupSigLEgacy().semigroups === null) {
  //     return false;
  //   } else {
  //     return (
  //       this.groupSigLEgacy()
  //         .semigroups?.map((semigroup: SemiGroup) =>
  //           semigroup.students?.some(
  //             (student: FreeSpotUser) => student.firstName === user.firstName && student.familyName === user.familyName,
  //           ),
  //         )
  //         ?.some((check: boolean) => check) || false
  //     );
  //   }
  // }

  // private _updateFaculty(updatedGroup: GroupLegacy): void {
  //   const updatedYear: Year = {
  //     ...this.yearSig(),
  //     yearGroupList: this.yearSig().yearGroupList.map((yearGroup: GroupLegacy) =>
  //       yearGroup.name === updatedGroup.name ? updatedGroup : yearGroup,
  //     ),
  //   };

  //   const updatedFaculty: FacultyLegacy = {
  //     ...this.facultySig(),
  //     yearList: this.facultySig().yearList?.map((year: Year) => (year.name === updatedYear.name ? updatedYear : year)),
  //   };
  //   this._adminFacultyService.updateFaculty(this.facultySig(), updatedFaculty);
  // }
}
