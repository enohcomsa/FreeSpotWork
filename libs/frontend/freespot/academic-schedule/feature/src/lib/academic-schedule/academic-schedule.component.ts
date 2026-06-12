import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { AcademicScheduleStore } from '@free-spot/academic-schedule/data-access';
import { type WeekDay } from '@free-spot/shared/domain';
import { TimetableItemComponent } from '@free-spot/shared/ui';
import { type TimetableActivityCardVM, type TimetableDayVM } from './timetable-activity.vm';
import { toTimetableActivityCardVM } from './timetable-activity.vm.mapper';

@Component({
  selector: 'free-spot-academic-schedule',
  imports: [TimetableItemComponent],
  templateUrl: 'academic-schedule.component.html',
  styleUrl: 'academic-schedule.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AcademicScheduleStore],
})
export class AcademicScheduleComponent implements OnInit {
  readonly store = inject(AcademicScheduleStore);

  private readonly workWeek: WeekDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  readonly timetablePerDaySig = computed<TimetableDayVM[]>(() =>
    this.workWeek.map((day) => ({
      day,
      activities: this.timetableCardVMListSig().filter((activity) => activity.weekDay === day),
    })),
  );

  private readonly timetableCardVMListSig = computed<TimetableActivityCardVM[]>(() =>
    this.store.timetableActivityListSig().map((activity) => toTimetableActivityCardVM(activity, this.store.roomListSig(), this.store.subjectListSig())),
  );

  ngOnInit(): void {
    this.store.init();
  }
}
