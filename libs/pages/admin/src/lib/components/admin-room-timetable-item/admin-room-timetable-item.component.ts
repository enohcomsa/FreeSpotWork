import { ChangeDetectionStrategy, Component, inject, input, model, OnInit } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { FormErrorMessage } from '@free-spot/util';

@Component({
  selector: 'free-spot-admin-room-timetable-item',

  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
],
  templateUrl: './admin-room-timetable-item.component.html',
  styleUrl: './admin-room-timetable-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomTimetableItemComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);

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
      startHour: [this.startHourList[0], Validators.required],
      subjectName: [this.subjectListSig()[0], [Validators.required, Validators.minLength(1)]],
      activityType: [Event.COURSE, Validators.required],
      weekParity: [WeekParity.BOTH, Validators.required],
    });
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  dysplaySubject(subjectItem: SubjectItem): string {
    if (subjectItem !== undefined && subjectItem !== null && Object.keys(subjectItem).length) {
      return subjectItem.shortName;
    }
    return '';
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
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this activity?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this._adminFacultyService.removeDeletedTimetableActivity(removedTimetableActivity);
          this.timetableItemSig.set({
            ...this.timetableItemSig(),
            activities: this.timetableItemSig().activities.filter(
              (timetableActivity: TimetableActivityItem) => timetableActivity !== removedTimetableActivity,
            ),
          });
        }
      });
  }
}
