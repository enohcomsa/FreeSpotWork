import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { type ActivityType, type WeekParity } from '@free-spot/shared/domain';
import { FormErrorMessage } from '@free-spot/shared/util';
import {
  type AdminRoomTimetableItemVm,
  type AdminRoomTimetableSubjectVm,
  type CreateAdminRoomTimetableActivityVm,
} from './admin-room-timetable-item.vm';

type AddTimetableActivityForm = FormGroup<{
  startHour: FormControl<number>;
  subject: FormControl<AdminRoomTimetableSubjectVm>;
  activityType: FormControl<ActivityType>;
  weekParity: FormControl<WeekParity>;
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

  readonly vm = input.required<AdminRoomTimetableItemVm>();

  readonly createTimetableActivity = output<CreateAdminRoomTimetableActivityVm>();
  readonly removeTimetableActivity = output<string>();

  readonly startHourList: number[] = [8, 10, 12, 14, 16, 18];
  readonly eventList: ActivityType[] = ['LABORATORY', 'COURSE', 'PROJECT', 'SEMINAR'];
  readonly weekParityList: WeekParity[] = ['BOTH', 'EVEN', 'ODD'];

  readonly activities = computed(() => this.vm().activities);
  readonly subjects = computed(() => this.vm().subjects);

  addingTimetableActivity = false;

  addTimetableActivityFormGroup!: AddTimetableActivityForm;

  ngOnInit(): void {
    this.addTimetableActivityFormGroup = this.formBuilder.nonNullable.group({
      startHour: [this.startHourList[0], Validators.required],
      subject: [this.subjects()[0], [Validators.required]],
      activityType: ['COURSE' as ActivityType, Validators.required],
      weekParity: ['BOTH' as WeekParity, Validators.required],
    });
  }

  displayError = (control: AbstractControl | null): string =>
    this.formErrorMessage.displayFormErrorMessage(control);

  displaySubject(subject: AdminRoomTimetableSubjectVm | null): string {
    return subject?.shortName ?? '';
  }

  getSubjectShortName(subjectId: string): string {
    return this.subjects().find((subject) => subject.id === subjectId)?.shortName ?? '';
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
    const subject = this.addTimetableActivityFormGroup.controls.subject.value;
    const startHour = this.addTimetableActivityFormGroup.controls.startHour.value;

    this.createTimetableActivity.emit({
      subjectId: subject.id,
      startHour,
      endHour: startHour + 2,
      weekDay: this.vm().day,
      activityType: this.addTimetableActivityFormGroup.controls.activityType.value,
      weekParity: this.addTimetableActivityFormGroup.controls.weekParity.value,
      capacity: this.vm().roomCapacity,
    });

    this.addTimetableActivityFormGroup.reset();
    this.addingTimetableActivity = false;
  }

  onRemoveTimetableActivity(removedTimetableActivityId: string): void {
    this.removeTimetableActivity.emit(removedTimetableActivityId);
  }
}
