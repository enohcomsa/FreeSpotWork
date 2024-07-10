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
import { TimeTableItem } from '@free-spot/models';
import { Event, WeekParity } from '@free-spot/enums';

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

  timetableItemSig = model.required<TimeTableItem>();
  subjectListSig = input.required<string[]>();

  startHourList: number[] = [8, 10, 12, 14, 16, 18];
  eventList: Event[] = [Event.COURSE, Event.LABORATORY, Event.PROJECT];
  weekParityList: WeekParity[] = [WeekParity.ODD, WeekParity.EVEN, WeekParity.BOTH];
  addTimetableActivityFormGroup!: FormGroup;
  addingTimetableActivity = false;

  ngOnInit(): void {
    this.addTimetableActivityFormGroup = this._formBuilder.group({
      startHour: [this.startHourList[0]],
      subjectName: [this.subjectListSig()[0]],
      activiteType: [Event.COURSE],
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
    this.addingTimetableActivity = false;
  }
}
