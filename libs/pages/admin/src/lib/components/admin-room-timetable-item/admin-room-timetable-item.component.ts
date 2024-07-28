import { ChangeDetectionStrategy, Component, inject, input, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Room, SubjectItem, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { Event, WeekParity } from '@free-spot/enums';
import { AdminFacultyService } from '@free-spot-service/faculty';

@Component({
  selector: 'free-spot-admin-room-timetable-item',
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
  templateUrl: './admin-room-timetable-item.component.html',
  styleUrl: './admin-room-timetable-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomTimetableItemComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);

  roomSig = input.required<Room>();
  timetableItemSig = model.required<TimeTableItem>();
  subjectListSig = input.required<SubjectItem[]>();

  startHourList: number[] = [8, 10, 12, 14, 16, 18];
  eventList: Event[] = Object.values(Event).filter((event: Event) => event !== Event.SPECIAL_EVENT);
  weekParityList: WeekParity[] = Object.values(WeekParity);
  addTimetableActivityFormGroup!: FormGroup;
  addingTimetableActivity = false;

  ngOnInit(): void {
    this._adminFacultyService.init();
    this.addTimetableActivityFormGroup = this._formBuilder.nonNullable.group({
      startHour: [this.startHourList[0]],
      subjectName: [this.subjectListSig()[0]],
      activityType: [Event.COURSE],
      weekParity: [WeekParity.BOTH],
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
    const newTimetableActivity: TimetableActivityItem = {
      startHour: this.addTimetableActivityFormGroup.controls['startHour'].value,
      endHour: this.addTimetableActivityFormGroup.controls['startHour'].value + 2,
      subjectItem: this.addTimetableActivityFormGroup.controls['subjectName'].value,
      roomName: this.roomSig().name,
      activityType: this.addTimetableActivityFormGroup.controls['activityType'].value,
      weekParity: this.addTimetableActivityFormGroup.controls['weekParity'].value,
      freeSpots: this.roomSig().totalSpotsNumber - this.roomSig().unavailableSpots,
      busySpots: 0,
      date: this.timetableItemSig().date,
    };

    this.timetableItemSig.set({
      ...this.timetableItemSig(),
      activities: this.timetableItemSig().activities
        ? [...this.timetableItemSig().activities, newTimetableActivity]
        : [newTimetableActivity],
    });
    this.addTimetableActivityFormGroup.reset();
    this.addingTimetableActivity = false;
  }

  onRemoveTimetableActivity(removedTimetableActivity: TimetableActivityItem): void {
    this._adminFacultyService.removeDeletedTimetableActivity(removedTimetableActivity);
    this.timetableItemSig.set({
      ...this.timetableItemSig(),
      activities: this.timetableItemSig().activities.filter(
        (timetableActivity: TimetableActivityItem) => timetableActivity !== removedTimetableActivity,
      ),
    });
  }
}
