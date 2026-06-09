import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal } from '@angular/core';
import { AdminUniversityMapStore } from '@free-spot/admin-university-map/data-access';
import {
  type AdminUniversityMapSubject,
  type UpdateAdminUniversityMapRoomCmd,
} from '@free-spot/admin-university-map/domain';
import { AdminRoomTimetableItemComponent } from '@free-spot/admin-university-map/ui';
import { type TimetableUiActivity, TimetableItemComponent, DynamicChipListComponent } from '@free-spot/shared/ui';
import { WeekDay } from '@free-spot/shared/domain';

@Component({
  selector: 'free-spot-admin-room-detail',
  imports: [DynamicChipListComponent, AdminRoomTimetableItemComponent, TimetableItemComponent],
  templateUrl: './admin-room-detail.component.html',
  styleUrl: './admin-room-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomDetailComponent implements OnInit {
  protected readonly store = inject(AdminUniversityMapStore);

  roomIdSig = input.required<string>();

  readonly roomSig = computed(() => this.store.getRoomById(this.roomIdSig())());
  readonly subjectListSig: Signal<AdminUniversityMapSubject[]> = this.store.subjectListSig;

  readonly roomSubjectListSig = computed<AdminUniversityMapSubject[]>(() => {
    const room = this.roomSig();

    if (!room) {
      return [];
    }

    return this.subjectListSig().filter((subjectItem) =>
      room.subjectList.some((subjectItemId) => subjectItemId === subjectItem.id),
    );
  });

  readonly roomTimetableActivitiesSig = computed(() =>
    this.store.selectTimetableActivitiesByRoomId(this.roomIdSig())(),
  );

  readonly timetableActivityCardVMs: Signal<TimetableUiActivity[]> = computed(() => {
    const room = this.roomSig();

    if (!room) {
      return [];
    }

    const subjectMap = new Map(this.subjectListSig().map((subject) => [subject.id, subject]));

    return this.roomTimetableActivitiesSig().map((activity) => {
      const subject = subjectMap.get(activity.subjectId);

      return {
        id: activity.id,
        weekDay: activity.weekDay,
        startHour: activity.startHour,
        endHour: activity.endHour,
        weekParity: activity.weekParity,
        activityType: activity.activityType,
        roomName: room.name,
        subjectItemShortName: subject?.shortName ?? '',
      };
    });
  });

  readonly workWeek: WeekDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  readonly localWorkWeek: WeekDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  readonly timetablePerDay = computed(() =>
    this.workWeek.map((day) => ({
      day,
      activities: this.timetableActivityCardVMs().filter((timetableActivity) => timetableActivity.weekDay === day),
    })),
  );

  readonly timetableActivitiesPerDay = computed(() =>
    this.localWorkWeek.map((day) => ({
      day,
      activities: this.roomTimetableActivitiesSig().filter((activity) => activity.weekDay === day),
    })),
  );

  ngOnInit(): void {
    this.store.init();
  }

  onSubjectListChange(subjectItemList: AdminUniversityMapSubject[]): void {
    const updatedRoom: UpdateAdminUniversityMapRoomCmd = {
      subjectList: subjectItemList.map((subjectItem) => subjectItem.id),
    };

    this.store.updateRoom(this.roomIdSig(), updatedRoom);
  }
}
