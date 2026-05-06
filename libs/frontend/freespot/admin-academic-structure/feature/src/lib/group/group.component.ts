import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal, viewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DynamicChipListComponent, TimetableItemComponent } from '@free-spot/ui';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { FormsModule } from '@angular/forms';
import { BuildingService } from '@free-spot-service/building';
import { AdminRoomService } from '@free-spot-service/room';
import { AppDateService } from '@free-spot-service/app-date';
import { UserService } from '@free-spot-service/user';
import { BookingService } from '@free-spot-service/booking';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { CohortService } from '@free-spot-service/cohort';
import { Cohort, CohortType, CreateCohortCmd } from '@free-spot-domain/cohort';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';
import { ProgramYearService } from '@free-spot-service/program-year';
import { ProgramService } from '@free-spot-service/program';
import { TimetableActivity, WeekDay } from '@free-spot/academic-schedule/domain';
import { TimetableActivityCardVM } from '@free-spot/academic-schedule/ui';
import { SubjectService } from '@free-spot-service/subject';
import { User } from '@free-spot-domain/user';
import { AdminGroupTimetableComponent, AdminSemisemiGroupTimetableComponent, } from '@free-spot/admin-timetabling/feature';

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
    const programId = this._adminProgramYearService.getSignalById(this.groupSig().programYearId)().programId;
    const facultyId = this._adminProgramService.getSignalById(programId)().facultyId;
    return this._adminFacultyService.getSignalById(facultyId)().subjectList;
  });

  groupIdSig = input.required<string>();
  readonly groupSig = computed(() => this._adminCohortService.getSignalById(this.groupIdSig())());
  readonly semigroupListSig = computed(() => this._adminCohortService.selectSemigroupByparentGroupId(this.groupIdSig())());
  readonly semiGroup1IdSig = computed(() => this.semigroupListSig()[0]?.id ?? null);
  readonly semiGroup2IdSig = computed(() => this.semigroupListSig()[1]?.id ?? null);

  readonly userListSig = this._userService.userListSig;

  readonly groupUserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.groupCohortId === this.groupIdSig())
  );

  readonly availableGroupUserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.groupCohortId !== this.groupIdSig())
  );

  readonly semigroup1UserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.semigroupCohortId === this.semiGroup1IdSig())
  );

  readonly semigroup2UserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.semigroupCohortId === this.semiGroup2IdSig())
  );

  readonly allSemigroupUsersListSig = computed(() => [
    ...this.semigroup1UserListSig(),
    ...this.semigroup2UserListSig(),
  ]);

  readonly availableSemigroup1UserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.groupCohortId === null)
  );

  readonly availableSemigroup2UserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.groupCohortId === null)
  );

  readonly nonDeletableSemigroupUsersListSig = computed(() => [] as User[]);

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

  updateGroupStudentList(updatedStudentGroupList: User[]): void {
    const currentStudentGroupList = this.groupUserListSig();

    const addedUser = updatedStudentGroupList.find(
      (user) => !currentStudentGroupList.some((currentUser) => currentUser.id === user.id)
    );

    if (addedUser) {
      this._userService.updateUser(addedUser.id, {
        groupCohortId: this.groupIdSig(),
        semigroupCohortId: null,
      });
      return;
    }

    const removedUser = currentStudentGroupList.find(
      (user) => !updatedStudentGroupList.some((updatedUser) => updatedUser.id === user.id)
    );

    if (removedUser) {
      this._userService.updateUser(removedUser.id, {
        groupCohortId: null,
        semigroupCohortId: null,
      });
    }
  }

  updateSemigroup1StudentList(updatedStudentSemigroupList: User[]): void {
    const currentStudentSemigroupList = this.semigroup1UserListSig();

    const addedUser = updatedStudentSemigroupList.find(
      (user) => !currentStudentSemigroupList.some((currentUser) => currentUser.id === user.id)
    );

    if (addedUser && this.semiGroup1IdSig()) {
      this._userService.updateUser(addedUser.id, {
        groupCohortId: this.groupIdSig(),
        semigroupCohortId: this.semiGroup1IdSig(),
      });
      return;
    }

    const removedUser = currentStudentSemigroupList.find(
      (user) => !updatedStudentSemigroupList.some((updatedUser) => updatedUser.id === user.id)
    );

    if (removedUser) {
      this._userService.updateUser(removedUser.id, {
        groupCohortId: null,
        semigroupCohortId: null,
      });
    }
  }

  updateSemigroup2StudentList(updatedStudentSemigroupList: User[]): void {
    const currentStudentSemigroupList = this.semigroup2UserListSig();

    const addedUser = updatedStudentSemigroupList.find(
      (user) => !currentStudentSemigroupList.some((currentUser) => currentUser.id === user.id)
    );

    if (addedUser && this.semiGroup2IdSig()) {
      this._userService.updateUser(addedUser.id, {
        groupCohortId: this.groupIdSig(),
        semigroupCohortId: this.semiGroup2IdSig(),
      });
      return;
    }

    const removedUser = currentStudentSemigroupList.find(
      (user) => !updatedStudentSemigroupList.some((updatedUser) => updatedUser.id === user.id)
    );

    if (removedUser) {
      this._userService.updateUser(removedUser.id, {
        groupCohortId: null,
        semigroupCohortId: null,
      });
    }
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
              type: CohortType.SEMIGROUP,
              programYearId: this.groupSig().programYearId,
              name: `${this.groupSig().name} sg1`,
              parentGroupId: this.groupIdSig()
            };

            const newSemigroup2: CreateCohortCmd = {
              type: CohortType.SEMIGROUP,
              programYearId: this.groupSig().programYearId,
              name: `${this.groupSig().name} sg2`,
              parentGroupId: this.groupIdSig()
            };

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
}
