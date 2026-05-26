import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminTimetablingStore } from '@free-spot/admin-timetabling/data-access';
import {
  type AdminTimetableActivity,
  type AdminTimetableActivityType,
  type AdminTimetableWeekDay,
} from '@free-spot/admin-timetabling/domain';
import { ConfirmModalService } from '@free-spot/core/ui';
import { FormErrorMessage } from  '@free-spot/shared/util';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'free-spot-admin-semigroup-timetable',
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
  templateUrl: './admin-semigroup-timetable.component.html',
  styleUrl: './admin-semigroup-timetable.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSemisemiGroupTimetableComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly formErrorMessage = inject(FormErrorMessage);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly store = inject(AdminTimetablingStore);

  semiGroupIdSig = input.required<string>();
  subjectListSig = input.required<string[]>();

  foundActivityListSig: WritableSignal<AdminTimetableActivity[]> = signal([]);

  protected semiGroupTimetableActivityListSig: Signal<AdminTimetableActivity[]> = computed(() =>
    this.store.selectTimetableActivityListByCohortId(this.semiGroupIdSig())(),
  );

  readonly startHourList: number[] = [8, 10, 12, 14, 16, 18];

  readonly eventList: AdminTimetableActivityType[] = [
    'LABORATORY',
    'COURSE',
    'PROJECT',
    'SEMINAR',
  ];

  readonly weekDayList: AdminTimetableWeekDay[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];

  addTimetableActivityFormSemiGroup!: FormGroup;
  addingTimetableActivity = false;

  emptyTimetableSig: Signal<boolean> = computed(() => this.semiGroupTimetableActivityListSig().length === 0);

  ngOnInit(): void {
    this.store.init();

    this.addTimetableActivityFormSemiGroup = this.formBuilder.nonNullable.group({
      weekDay: ['MONDAY' as AdminTimetableWeekDay, [Validators.required, Validators.minLength(1)]],
      subject: [this.subjectListSig()[0], [Validators.required, Validators.minLength(1)]],
      timetableActivity: [{} as AdminTimetableActivity, [Validators.required, Validators.minLength(1)]],
    });

    this.addTimetableActivityFormSemiGroup.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const foundTimetableActivities = this.store
        .selectTimetableActivityListBySubjectIdAndWeekDay(
          this.addTimetableActivityFormSemiGroup.controls['subject'].value,
          this.addTimetableActivityFormSemiGroup.controls['weekDay'].value,
        )()
        .filter((timetableActivity) => !timetableActivity.cohortIds.includes(this.semiGroupIdSig()));

      this.foundActivityListSig.set(foundTimetableActivities);
    });
  }

  displayError = (control: AbstractControl | null): string => this.formErrorMessage.displayFormErrorMessage(control);

  getSubjectShortNameById(subjectId: string): string {
    return this.store.getSubjectById(subjectId)()?.shortName ?? '';
  }

  getRoomNameById(roomId: string): string {
    return this.store.getRoomById(roomId)()?.name ?? '';
  }

  displaySubject = (subjectId?: string | null): string => (subjectId ? this.getSubjectShortNameById(subjectId) : '');

  displayTimetableActivity = (timetableActivity?: AdminTimetableActivity | null): string => {
    if (!timetableActivity?.id) {
      return '';
    }

    return `${timetableActivity.startHour} ${timetableActivity.activityType} ${this.getRoomNameById(timetableActivity.roomId)} ${timetableActivity.weekParity}`;
  };

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
    const timetableActivity = this.addTimetableActivityFormSemiGroup.controls['timetableActivity'].value as AdminTimetableActivity | null;

    if (!timetableActivity?.id) {
      return;
    }

    this.store.addCohortToActivity(this.semiGroupIdSig(), timetableActivity.id);
    this.addTimetableActivityFormSemiGroup.reset();
    this.addingTimetableActivity = false;
  }

  onRemoveTimetableActivity(deletedTimetableActivityId: string): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to delete this activity?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.store.removeCohortFromActivity(this.semiGroupIdSig(), deletedTimetableActivityId);
        }
      });
  }
}
