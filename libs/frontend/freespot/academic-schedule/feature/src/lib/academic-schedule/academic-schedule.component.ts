import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TimetableItemComponent } from "@free-spot/shared/ui";
import { AcademicScheduleStore } from '@free-spot/academic-schedule/data-access';

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

  ngOnInit(): void {
    this.store.init();
  }
}
