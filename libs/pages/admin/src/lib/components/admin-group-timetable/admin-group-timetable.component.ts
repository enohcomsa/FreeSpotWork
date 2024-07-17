import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group, SubjectItem, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { Event, WeekDay } from '@free-spot/enums';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminRoomService } from '@free-spot-service/room';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'free-spot-admin-group-timetable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './admin-group-timetable.component.html',
  styleUrl: './admin-group-timetable.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGroupTimetableComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);

  groupSig = model.required<Group>();
  subjectListSig = input.required<SubjectItem[]>();
  foundActivitiesSig: WritableSignal<TimetableActivityItem[]> = signal([]);

  startHourList: number[] = [8, 10, 12, 14, 16, 18];
  eventList: Event[] = Object.values(Event).filter((event: Event) => event !== Event.SPECIAL_EVENT);
  weekDayList: WeekDay[] = Object.values(WeekDay);
  addTimetableActivityFormGroup!: FormGroup;
  addingTimetableActivity = false;

  emptyTimetableSig: Signal<boolean> = computed(() => {
    return !this.groupSig()
      ?.timetable.map((timetableItem: TimeTableItem) =>
        timetableItem.activities ? timetableItem.activities.length !== 0 : !!timetableItem.activities,
      )
      .some((timetableItem: boolean) => timetableItem === true);
  });

  ngOnInit(): void {
    this.addTimetableActivityFormGroup = this._formBuilder.nonNullable.group({
      weekDay: [WeekDay.MONDAY],
      subject: [this.subjectListSig()[0]],
      timetableActivity: [{}],
    });
    this.addTimetableActivityFormGroup.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.foundActivitiesSig.set(
        this._adminRoomService.getTimetableActivitiesByWeekDayAndSubject(
          this.addTimetableActivityFormGroup.controls['weekDay'].value,
          this.addTimetableActivityFormGroup.controls['subject'].value,
        ),
      );
    });
  }

  getTimeInterval(startHour: number): string {
    switch (startHour) {
      case 8:
        return '08-10';
      case 10:
        return '10-12';
      case 12:
        return '12-14';
      case 14:
        return '14-16';
      case 16:
        return '16-18';
      case 18:
        return '18-20';
      default:
        return '';
    }
  }

  onAddTimetableActivity(): void {
    if (this.groupSig !== undefined) {
      const newTimetableActivity: TimetableActivityItem = this.addTimetableActivityFormGroup.controls['timetableActivity'].value;

      const oldTimetableItem: TimeTableItem = this.groupSig().timetable?.find(
        (timetableItem: TimeTableItem) => timetableItem.weekDay === this.addTimetableActivityFormGroup.controls['weekDay'].value,
      ) || { weekDay: this.addTimetableActivityFormGroup.controls['weekDay'].value, activities: [] };

      const newTimetableItem: TimeTableItem = {
        ...oldTimetableItem,
        activities: oldTimetableItem.activities ? [...oldTimetableItem.activities, newTimetableActivity] : [newTimetableActivity],
      };
      const updatedGroup: Group = {
        ...this.groupSig(),
        timetable: this.groupSig().timetable
          ? (this.groupSig().timetable.map((timetableItem: TimeTableItem) =>
              timetableItem.weekDay === newTimetableItem.weekDay ? newTimetableItem : timetableItem,
            ) as TimeTableItem[])
          : [newTimetableItem],
      };
      this.groupSig.set(updatedGroup);
    }

    this.addTimetableActivityFormGroup.reset();
    this.addingTimetableActivity = false;
  }

  onRemoveTimetableActivity(deletedTimetableActivity: TimetableActivityItem): void {
    const oldTimetableItem: TimeTableItem = this.groupSig().timetable?.find(
      (timetableItem: TimeTableItem) => timetableItem.weekDay === this.addTimetableActivityFormGroup.controls['weekDay'].value,
    ) as TimeTableItem;

    const newTimetableItem: TimeTableItem = {
      ...oldTimetableItem,
      activities: oldTimetableItem.activities.filter(
        (timetableActivity: TimetableActivityItem) => timetableActivity !== deletedTimetableActivity,
      ),
    };

    const updatedGroup: Group = {
      ...this.groupSig(),
      timetable: this.groupSig().timetable
        ? this.groupSig().timetable.map((timetableItem: TimeTableItem) =>
            timetableItem.weekDay === newTimetableItem.weekDay ? newTimetableItem : timetableItem,
          )
        : [newTimetableItem],
    };
    this.groupSig.set(updatedGroup);
  }
}
