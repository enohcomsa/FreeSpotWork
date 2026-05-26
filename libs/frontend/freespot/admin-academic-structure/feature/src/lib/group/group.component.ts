import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminAcademicStructureStore } from '@free-spot/admin-academic-structure/data-access';
import {
  type AdminAcademicTimetableActivity,
  type AdminAcademicUser,
  type CreateAdminCohortCmd,
} from '@free-spot/admin-academic-structure/domain';
import { AdminGroupTimetableComponent, AdminSemisemiGroupTimetableComponent } from '@free-spot/admin-timetabling/feature';
import { ConfirmModalService } from '@free-spot/core/ui';
import { type TimetableUiActivity, type TimetableUiWeekDay, TimetableItemComponent, DynamicChipListComponent } from '@free-spot/shared/ui';


@Component({
  selector: 'free-spot-group',

  imports: [
    FormsModule,
    DynamicChipListComponent,
    MatTabsModule,
    AdminGroupTimetableComponent,
    MatSlideToggleModule,
    AdminSemisemiGroupTimetableComponent,
    MatTooltipModule,
    TimetableItemComponent,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent implements OnInit {
  private readonly academicStructureStore = inject(AdminAcademicStructureStore);
  private readonly confirmService = inject(ConfirmModalService);

  groupIdSig = input.required<string>();

  readonly groupSig = computed(() => this.academicStructureStore.getCohortById(this.groupIdSig())());
  readonly semigroupListSig = computed(() =>
    this.academicStructureStore.selectSemigroupsByParentGroupId(this.groupIdSig())(),
  );
  readonly semiGroup1IdSig = computed(() => this.semigroupListSig()[0]?.id ?? null);
  readonly semiGroup2IdSig = computed(() => this.semigroupListSig()[1]?.id ?? null);

  readonly facultySubjectListSig = computed<string[]>(() => {
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

  readonly userListSig = this.academicStructureStore.userListSig;

  readonly groupUserListSig = computed<AdminAcademicUser[]>(() =>
    this.userListSig().filter((user) => user.groupCohortId === this.groupIdSig()),
  );

  readonly availableGroupUserListSig = computed<AdminAcademicUser[]>(() =>
    this.userListSig().filter((user) => user.groupCohortId !== this.groupIdSig()),
  );

  readonly semigroup1UserListSig = computed<AdminAcademicUser[]>(() =>
    this.userListSig().filter((user) => user.semigroupCohortId === this.semiGroup1IdSig()),
  );

  readonly semigroup2UserListSig = computed<AdminAcademicUser[]>(() =>
    this.userListSig().filter((user) => user.semigroupCohortId === this.semiGroup2IdSig()),
  );

  readonly allSemigroupUsersListSig = computed<AdminAcademicUser[]>(() => [
    ...this.semigroup1UserListSig(),
    ...this.semigroup2UserListSig(),
  ]);

  readonly availableSemigroup1UserListSig = computed<AdminAcademicUser[]>(() =>
    this.userListSig().filter((user) => user.groupCohortId === null),
  );

  readonly availableSemigroup2UserListSig = computed<AdminAcademicUser[]>(() =>
    this.userListSig().filter((user) => user.groupCohortId === null),
  );

  readonly nonDeletableSemigroupUsersListSig = computed<AdminAcademicUser[]>(() => []);

  readonly workWeek: TimetableUiWeekDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  readonly groupTimetableActivityCardVMs = this.cardVMsByCohortId(this.groupIdSig);
  readonly semigroup1TimetableActivityCardVMs = this.cardVMsByCohortId(this.semiGroup1IdSig);
  readonly semigroup2TimetableActivityCardVMs = this.cardVMsByCohortId(this.semiGroup2IdSig);

  readonly timetableGroupPerDay = this.perDay(this.groupTimetableActivityCardVMs);
  readonly timetableSemigroup1PerDay = this.perDay(this.semigroup1TimetableActivityCardVMs);
  readonly timetableSemigroup2PerDay = this.perDay(this.semigroup2TimetableActivityCardVMs);

  semigroupToggle = viewChild.required<MatSlideToggle>('semigroupsToggle');
  semigroupsEnabledSig = computed<boolean>(() => !!this.semigroupListSig().length);

  ngOnInit(): void {
    this.academicStructureStore.init();
  }

  updateGroupStudentList(updatedStudentGroupList: AdminAcademicUser[]): void {
    const currentStudentGroupList = this.groupUserListSig();

    const addedUser = updatedStudentGroupList.find(
      (user) => !currentStudentGroupList.some((currentUser) => currentUser.id === user.id),
    );

    if (addedUser) {
      this.academicStructureStore.updateUser(addedUser.id, {
        groupCohortId: this.groupIdSig(),
        semigroupCohortId: null,
      });
      return;
    }

    const removedUser = currentStudentGroupList.find(
      (user) => !updatedStudentGroupList.some((updatedUser) => updatedUser.id === user.id),
    );

    if (removedUser) {
      this.academicStructureStore.updateUser(removedUser.id, {
        groupCohortId: null,
        semigroupCohortId: null,
      });
    }
  }

  updateSemigroup1StudentList(updatedStudentSemigroupList: AdminAcademicUser[]): void {
    const currentStudentSemigroupList = this.semigroup1UserListSig();

    const addedUser = updatedStudentSemigroupList.find(
      (user) => !currentStudentSemigroupList.some((currentUser) => currentUser.id === user.id),
    );

    const semiGroup1Id = this.semiGroup1IdSig();

    if (addedUser && semiGroup1Id) {
      this.academicStructureStore.updateUser(addedUser.id, {
        groupCohortId: this.groupIdSig(),
        semigroupCohortId: semiGroup1Id,
      });
      return;
    }

    const removedUser = currentStudentSemigroupList.find(
      (user) => !updatedStudentSemigroupList.some((updatedUser) => updatedUser.id === user.id),
    );

    if (removedUser) {
      this.academicStructureStore.updateUser(removedUser.id, {
        groupCohortId: null,
        semigroupCohortId: null,
      });
    }
  }

  updateSemigroup2StudentList(updatedStudentSemigroupList: AdminAcademicUser[]): void {
    const currentStudentSemigroupList = this.semigroup2UserListSig();

    const addedUser = updatedStudentSemigroupList.find(
      (user) => !currentStudentSemigroupList.some((currentUser) => currentUser.id === user.id),
    );

    const semiGroup2Id = this.semiGroup2IdSig();

    if (addedUser && semiGroup2Id) {
      this.academicStructureStore.updateUser(addedUser.id, {
        groupCohortId: this.groupIdSig(),
        semigroupCohortId: semiGroup2Id,
      });
      return;
    }

    const removedUser = currentStudentSemigroupList.find(
      (user) => !updatedStudentSemigroupList.some((updatedUser) => updatedUser.id === user.id),
    );

    if (removedUser) {
      this.academicStructureStore.updateUser(removedUser.id, {
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
          const newSemigroup1: CreateAdminCohortCmd = {
            type: 'SEMIGROUP',
            programYearId: group.programYearId,
            name: `${group.name} sg1`,
            parentGroupId: this.groupIdSig(),
          };

          const newSemigroup2: CreateAdminCohortCmd = {
            type: 'SEMIGROUP',
            programYearId: group.programYearId,
            name: `${group.name} sg2`,
            parentGroupId: this.groupIdSig(),
          };

          this.academicStructureStore.createCohort(newSemigroup1);
          this.academicStructureStore.createCohort(newSemigroup2);
          return;
        }

        this.semigroupListSig().forEach((semiGroup) => {
          this.academicStructureStore.deleteCohort(semiGroup.id);
        });
      });
  }

  private roomNameById(roomId: string): string {
    return this.academicStructureStore.getRoomById(roomId)()?.name ?? '';
  }

  private subjectShortNameById(subjectId: string): string {
    return this.academicStructureStore.getSubjectById(subjectId)()?.shortName ?? '';
  }

  private toCardVM = (timetableActivity: AdminAcademicTimetableActivity): TimetableUiActivity => ({
    id: timetableActivity.id,
    weekDay: timetableActivity.weekDay,
    startHour: timetableActivity.startHour,
    endHour: timetableActivity.endHour,
    weekParity: timetableActivity.weekParity,
    activityType: timetableActivity.activityType,
    roomName: this.roomNameById(timetableActivity.roomId),
    subjectItemShortName: this.subjectShortNameById(timetableActivity.subjectId),
  });

  private activitiesByCohortId(cohortIdSig: Signal<string | null>): Signal<AdminAcademicTimetableActivity[]> {
    return computed(() => {
      const cohortId = cohortIdSig();

      return cohortId ? this.academicStructureStore.selectTimetableActivitiesByCohortId(cohortId)() : [];
    });
  }

  private cardVMsByCohortId(cohortIdSig: Signal<string | null>): Signal<TimetableUiActivity[]> {
    const activitiesSig = this.activitiesByCohortId(cohortIdSig);

    return computed(() => activitiesSig().map((activity) => this.toCardVM(activity)));
  }

  private perDay(cardVMsSig: Signal<TimetableUiActivity[]>): Signal<{ day: TimetableUiWeekDay; activities: TimetableUiActivity[] }[]> {
    return computed(() => {
      const all = cardVMsSig();

      return this.workWeek.map((day) => ({
        day,
        activities: all.filter((activity) => activity.weekDay === day),
      }));
    });
  }
}
