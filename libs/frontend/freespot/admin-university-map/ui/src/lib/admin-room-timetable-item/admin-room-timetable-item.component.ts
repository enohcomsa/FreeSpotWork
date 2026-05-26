import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  type AdminUniversityMapActivityType,
  type AdminUniversityMapSubject,
  type AdminUniversityMapTimetableActivity,
  type AdminUniversityMapWeekDay,
  type AdminUniversityMapWeekParity,
  type CreateAdminUniversityMapTimetableActivityCmd,
} from '@free-spot/admin-university-map/domain';
import { FormErrorMessage } from  '@free-spot/shared/util';

type AddTimetableActivityForm = FormGroup<{
  startHour: FormControl<number>;
  subjectName: FormControl<AdminUniversityMapSubject>;
  activityType: FormControl<AdminUniversityMapActivityType>;
  weekParity: FormControl<AdminUniversityMapWeekParity>;
}>;

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
    MatTooltipModule,
  ],
  templateUrl: './admin-room-timetable-item.component.html',
  styleUrl: './admin-room-timetable-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomTimetableItemComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly formErrorMessage = inject(FormErrorMessage);

  roomIdSig = input.required<string>();
  roomNameSig = input.required<string>();
  roomCapacitySig = input.required<number>();
  day = input.required<AdminUniversityMapWeekDay>();
  subjectListSig = input.required<AdminUniversityMapSubject[]>();
  dayTimetableActivityCardVMListSig = input.required<AdminUniversityMapTimetableActivity[]>();

  createTimetableActivity = output<CreateAdminUniversityMapTimetableActivityCmd>();
  removeTimetableActivity = output<string>();

  readonly startHourList: number[] = [8, 10, 12, 14, 16, 18];

  readonly eventList: AdminUniversityMapActivityType[] = [
    'LABORATORY',
    'COURSE',
    'PROJECT',
    'SEMINAR',
  ];

  readonly weekParityList: AdminUniversityMapWeekParity[] = ['BOTH', 'EVEN', 'ODD'];

  addingTimetableActivity = false;

  addTimetableActivityFormGroup!: AddTimetableActivityForm;

  ngOnInit(): void {
    this.addTimetableActivityFormGroup = this.formBuilder.nonNullable.group({
      startHour: [this.startHourList[0], Validators.required],
      subjectName: [this.subjectListSig()[0], [Validators.required, Validators.minLength(1)]],
      activityType: ['COURSE' as AdminUniversityMapActivityType, Validators.required],
      weekParity: ['BOTH' as AdminUniversityMapWeekParity, Validators.required],
    });
  }

  dysplaySubject(subjectItem: AdminUniversityMapSubject | null): string {
    return subjectItem?.shortName ?? '';
  }

  getSubjectShortName(subjectId: string): string {
    return this.subjectListSig().find((subject) => subject.id === subjectId)?.shortName ?? '';
  }

  displayError = (control: AbstractControl | null): string =>
    this.formErrorMessage.displayFormErrorMessage(control);

  displaySubject(subjectItem: AdminUniversityMapSubject | null): string {
    return subjectItem?.shortName ?? '';
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
    const subject = this.addTimetableActivityFormGroup.controls.subjectName.value;
    const startHour = this.addTimetableActivityFormGroup.controls.startHour.value;

    const cmd: CreateAdminUniversityMapTimetableActivityCmd = {
      roomId: this.roomIdSig(),
      subjectId: subject.id,
      date: new Date().toISOString(),
      weekDay: this.day(),
      activityType: this.addTimetableActivityFormGroup.controls.activityType.value,
      cohortIds: [],
      startHour,
      endHour: startHour + 2,
      weekParity: this.addTimetableActivityFormGroup.controls.weekParity.value,
      capacity: this.roomCapacitySig(),
      reservedSpots: 0,
      busySpots: 0,
      freeSpots: this.roomCapacitySig(),
    };

    this.createTimetableActivity.emit(cmd);
    this.addTimetableActivityFormGroup.reset();
    this.addingTimetableActivity = false;
  }

  onRemoveTimetableActivity(removedTimetableActivityId: string): void {
    this.removeTimetableActivity.emit(removedTimetableActivityId);
  }
}
