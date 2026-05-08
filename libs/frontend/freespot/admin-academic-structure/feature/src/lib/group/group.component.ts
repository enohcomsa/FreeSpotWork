import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal, viewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DynamicChipListComponent, TimetableItemComponent } from '@free-spot/ui';
import { FormsModule } from '@angular/forms';
import { BuildingService } from '@free-spot-service/building';
import { AdminRoomService } from '@free-spot-service/room';
import { AppDateService } from '@free-spot-service/app-date';
import { UserService } from '@free-spot-service/user';
import { BookingService } from '@free-spot-service/booking';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from '@free-spot/core/ui';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';
import { TimetableActivity, WeekDay, TimetableActivityCardVM } from '@free-spot/academic-schedule/domain';
import { User } from '@free-spot/core/domain';
import { AdminGroupTimetableComponent, AdminSemisemiGroupTimetableComponent } from '@free-spot/admin-timetabling/feature';

import { AdminAcademicStructureStore } from '@free-spot/admin-academic-structure/data-access';
import {
  AdminAcademicCohortType,
  AdminCohort,
  CreateAdminCohortCmd,
} from '@free-spot/admin-academic-structure/domain';

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
    MatTooltipModule,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent implements OnInit {
  private readonly academicStructureStore = inject(AdminAcademicStructureStore);
  private readonly adminTimetableActivityService = inject(AdminTimetableActivityService);
  private readonly adminRoomService = inject(AdminRoomService);
  private readonly adminBuildingService = inject(BuildingService);
  private readonly appDateService = inject(AppDateService);
  private readonly userService = inject(UserService);
  private readonly bookingService = inject(BookingService);
  private readonly confirmService = inject(ConfirmModalService);

  groupIdSig = input.required<string>();

  readonly groupSig = computed(() => this.academicStructureStore.getCohortById(this.groupIdSig())());
  readonly semigroupListSig = computed(() =>
    this.academicStructureStore.selectSemigroupsByParentGroupId(this.groupIdSig())(),
  );
  readonly semiGroup1IdSig = computed(() => this.semigroupListSig()[0]?.id ?? null);
  readonly semiGroup2IdSig = computed(() => this.semigroupListSig()[1]?.id ?? null);

  readonly facultySubjectListSig = computed(() => {
    const group = this.groupSig();

    if (!group) {
      return [];
    }

    const programYear = this.academicStructureStore.getProgramYearById(group.programYearId)();

    if (!programYear) {
      return [];
    }

    const program = this.academicStructureStore.getProgramById(programYear.programId)();

    if (!program) {
      return [];
    }

    const faculty = this.academicStructureStore.getFacultyById(program.facultyId)();

    return faculty?.subjectList ?? [];
  });

  readonly userListSig = this.userService.userListSig;

  readonly groupUserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.groupCohortId === this.groupIdSig()),
  );

  readonly availableGroupUserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.groupCohortId !== this.groupIdSig()),
  );

  readonly semigroup1UserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.semigroupCohortId === this.semiGroup1IdSig()),
  );

  readonly semigroup2UserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.semigroupCohortId === this.semiGroup2IdSig()),
  );

  readonly allSemigroupUsersListSig = computed(() => [
    ...this.semigroup1UserListSig(),
    ...this.semigroup2UserListSig(),
  ]);

  readonly availableSemigroup1UserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.groupCohortId === null),
  );

  readonly availableSemigroup2UserListSig = computed(() =>
    this.userListSig().filter((user: User) => user.groupCohortId === null),
  );

  readonly nonDeletableSemigroupUsersListSig = computed(() => [] as User[]);

  readonly workWeek: WeekDay[] = [
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
  ];

  readonly groupTimetableActivityCardVMs = this.cardVMsByCohortId(this.groupIdSig);
  readonly semigroup1TimetableActivityCardVMs = this.cardVMsByCohortId(this.semiGroup1IdSig);
  readonly semigroup2TimetableActivityCardVMs = this.cardVMsByCohortId(this.semiGroup2IdSig);

  readonly timetableGroupPerDay = this.perDay(this.groupTimetableActivityCardVMs);
  readonly timetableSemigroup1PerDay = this.perDay(this.semigroup1TimetableActivityCardVMs);
  readonly timetableSemigroup2PerDay = this.perDay(this.semigroup2TimetableActivityCardVMs);

  semigroupToggle = viewChild.required<MatSlideToggle>('semigroupsToggle');
  semigroupsEnabledSig = computed(() => !!this.semigroupListSig().length);

  ngOnInit(): void {
    this.adminRoomService.init();
    this.adminBuildingService.init();
    this.appDateService.init();
    this.userService.init();
    this.bookingService.init();
    this.adminTimetableActivityService.init();
  }

  updateGroupStudentList(updatedStudentGroupList: User[]): void {
    const currentStudentGroupList = this.groupUserListSig();

    const addedUser = updatedStudentGroupList.find(
      (user) => !currentStudentGroupList.some((currentUser) => currentUser.id === user.id),
    );

    if (addedUser) {
      this.userService.updateUser(addedUser.id, {
        groupCohortId: this.groupIdSig(),
        semigroupCohortId: null,
      });
      return;
    }

    const removedUser = currentStudentGroupList.find(
      (user) => !updatedStudentGroupList.some((updatedUser) => updatedUser.id === user.id),
    );

    if (removedUser) {
      this.userService.updateUser(removedUser.id, {
        groupCohortId: null,
        semigroupCohortId: null,
      });
    }
  }

  updateSemigroup1StudentList(updatedStudentSemigroupList: User[]): void {
    const currentStudentSemigroupList = this.semigroup1UserListSig();

    const addedUser = updatedStudentSemigroupList.find(
      (user) => !currentStudentSemigroupList.some((currentUser) => currentUser.id === user.id),
    );

    const semiGroup1Id = this.semiGroup1IdSig();

    if (addedUser && semiGroup1Id) {
      this.userService.updateUser(addedUser.id, {
        groupCohortId: this.groupIdSig(),
        semigroupCohortId: semiGroup1Id,
      });
      return;
    }

    const removedUser = currentStudentSemigroupList.find(
      (user) => !updatedStudentSemigroupList.some((updatedUser) => updatedUser.id === user.id),
    );

    if (removedUser) {
      this.userService.updateUser(removedUser.id, {
        groupCohortId: null,
        semigroupCohortId: null,
      });
    }
  }

  updateSemigroup2StudentList(updatedStudentSemigroupList: User[]): void {
    const currentStudentSemigroupList = this.semigroup2UserListSig();

    const addedUser = updatedStudentSemigroupList.find(
      (user) => !currentStudentSemigroupList.some((currentUser) => currentUser.id === user.id),
    );

    const semiGroup2Id = this.semiGroup2IdSig();

    if (addedUser && semiGroup2Id) {
      this.userService.updateUser(addedUser.id, {
        groupCohortId: this.groupIdSig(),
        semigroupCohortId: semiGroup2Id,
      });
      return;
    }

    const removedUser = currentStudentSemigroupList.find(
      (user) => !updatedStudentSemigroupList.some((updatedUser) => updatedUser.id === user.id),
    );

    if (removedUser) {
      this.userService.updateUser(removedUser.id, {
        groupCohortId: null,
        semigroupCohortId: null,
      });
    }
  }

  toggleSemigroups(enableSemigroups: boolean): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to switch semigroups? Timetable data will be lost!')
      .afterClosed()
      .subscribe((result: boolean) => {
        const group = this.groupSig();

        if (!result || !group) {
          this.semigroupToggle().checked = !this.semigroupToggle()?.checked;
          return;
        }

        if (enableSemigroups) {
          this.adminTimetableActivityService.removeCohortFromAllActivities(this.groupIdSig());

          const newSemigroup1: CreateAdminCohortCmd = {
            type: AdminAcademicCohortType.Semigroup,
            programYearId: group.programYearId,
            name: `${group.name} sg1`,
            parentGroupId: this.groupIdSig(),
          };

          const newSemigroup2: CreateAdminCohortCmd = {
            type: AdminAcademicCohortType.Semigroup,
            programYearId: group.programYearId,
            name: `${group.name} sg2`,
            parentGroupId: this.groupIdSig(),
          };

          this.academicStructureStore.createCohort(newSemigroup1);
          this.academicStructureStore.createCohort(newSemigroup2);
          return;
        }

        this.semigroupListSig().forEach((semiGroup: AdminCohort) => {
          this.adminTimetableActivityService.removeCohortFromAllActivities(semiGroup.id);
          this.academicStructureStore.deleteCohort(semiGroup.id);
        });
      });
  }

  private roomNameById(roomId: string): string {
    return this.adminRoomService.getSignalById(roomId)()?.name ?? '';
  }

  private subjectShortNameById(subjectId: string): string {
    return this.academicStructureStore.getSubjectById(subjectId)()?.shortName ?? '';
  }

  private toCardVM = (timetableActivity: TimetableActivity): TimetableActivityCardVM => ({
    id: timetableActivity.id,
    weekDay: timetableActivity.weekDay,
    startHour: timetableActivity.startHour,
    endHour: timetableActivity.endHour,
    weekParity: timetableActivity.weekParity,
    activityType: timetableActivity.activityType,
    roomName: this.roomNameById(timetableActivity.roomId),
    subjectItemShortName: this.subjectShortNameById(timetableActivity.subjectId),
  });

  private activitiesByCohortId(cohortIdSig: Signal<string | null>): Signal<TimetableActivity[]> {
    return computed(() => {
      const cohortId = cohortIdSig();

      return cohortId
        ? this.adminTimetableActivityService.selectTimetableActivityListSignalByCohortId(cohortId)()
        : [];
    });
  }

  private cardVMsByCohortId(cohortIdSig: Signal<string | null>): Signal<TimetableActivityCardVM[]> {
    const activitiesSig = this.activitiesByCohortId(cohortIdSig);
    return computed(() => activitiesSig().map(this.toCardVM));
  }

  private perDay(cardVMsSig: Signal<TimetableActivityCardVM[]>) {
    return computed(() => {
      const all = cardVMsSig();

      return this.workWeek.map((day) => ({
        day,
        activities: all.filter((activity) => activity.weekDay === day),
      }));
    });
  }
}
