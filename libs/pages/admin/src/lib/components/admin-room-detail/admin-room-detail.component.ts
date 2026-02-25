import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal } from '@angular/core';
import { DynamicChipListComponent, TimetableItemComponent } from '@free-spot/ui';
import { AdminRoomTimetableItemComponent } from '../admin-room-timetable-item/admin-room-timetable-item.component';
import { AdminRoomService } from '@free-spot-service/room';
import { SubjectService } from '@free-spot-service/subject';
import { UpdateRoomCmd } from '@free-spot-domain/room';
import { SubjectItem } from '@free-spot-domain/subject';
import { TimetableActivityCardVM } from '@free-spot-presentation/timetable-activity-card';
import { WeekDay } from '@free-spot/enums';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';
import { TimetableActivity } from '@free-spot-domain/timetable-activity';

@Component({
  selector: 'free-spot-admin-room-detail',
  imports: [DynamicChipListComponent, AdminRoomTimetableItemComponent, TimetableItemComponent],
  templateUrl: './admin-room-detail.component.html',
  styleUrl: './admin-room-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomDetailComponent implements OnInit {
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminSubjectService: SubjectService = inject(SubjectService);
  private _adminTimetableActivityService: AdminTimetableActivityService = inject(AdminTimetableActivityService);

  roomIdSig = input.required<string>();
  readonly roomSig = computed(() => this._adminRoomService.getSignalById(this.roomIdSig())());
  subjectListSig: Signal<SubjectItem[]> = this._adminSubjectService.subjectListSig;
  readonly roomSubjectListSig = computed(() =>
    this.subjectListSig().filter((subjectItem: SubjectItem) =>
      this.roomSig().subjectList.some((subjectItemId) => subjectItemId === subjectItem.id)));
  readonly roomTimetableActivitiesSig: Signal<TimetableActivity[]> = computed(() => this._adminTimetableActivityService.getTimetableActivityListSignalByRoomId(this.roomIdSig())());
  readonly timetableActivityCardVMs: Signal<TimetableActivityCardVM[]> = computed(() => {
    const room = this.roomSig();
    const subjects = this.subjectListSig();
    const subjectMap = new Map(subjects.map(s => [s.id, s]));
    return this.roomTimetableActivitiesSig().map(activity => {
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
      } satisfies TimetableActivityCardVM;
    });
  });

  readonly workWeek: WeekDay[] = [
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
  ];

  readonly timetablePerDay = computed(() => {
    const allTimetableActivities = this.timetableActivityCardVMs() ?? [];
    return this.workWeek.map((day: WeekDay) => ({
      day,
      activities: allTimetableActivities.filter((timetableActivity) => timetableActivity.weekDay === day),
    }));
  });

  ngOnInit(): void {
    this._adminRoomService.init();
    this._adminSubjectService.init();
    this._adminTimetableActivityService.init();
  }

  onSubjectListChange(subjectItemList: SubjectItem[]): void {
    const updatedRoom: UpdateRoomCmd = {
      subjectList: subjectItemList.map((subjectItem: SubjectItem) => subjectItem.id),
    }
    this._adminRoomService.update(this.roomIdSig(), updatedRoom);
  }
}
