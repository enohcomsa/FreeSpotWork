import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
  signal,
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
import { ConfirmModalService } from '@free-spot/core/ui';
import { FormErrorMessage } from '@free-spot/util';
import { debounceTime } from 'rxjs';

import { AdminTimetablingStore } from '@free-spot/admin-timetabling/data-access';
import {
  AdminTimetableActivity,
  AdminTimetableActivityType,
  AdminTimetableWeekDay,
} from '@free-spot/admin-timetabling/domain';

@Component({
  selector: 'free-spot-admin-group-timetable',
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
  templateUrl: './admin-group-timetable.component.html',
  styleUrl: './admin-group-timetable.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGroupTimetableComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly formErrorMessage = inject(FormErrorMessage);
  private readonly store = inject(AdminTimetablingStore);

  groupIdSig = input.required<string>();
  subjectListSig = input.required<string[]>();

  protected groupTimetableActivityListSig: Signal<AdminTimetableActivity[]> = computed(() =>
    this.store.selectTimetableActivityListByCohortId(this.groupIdSig())(),
  );

  foundActivityListSig: WritableSignal<AdminTimetableActivity[]> = signal([]);

  startHourList: number[] = [8, 10, 12, 14, 16, 18];
  activityTypeList: AdminTimetableActivityType[] = Object.values(AdminTimetableActivityType).filter(
    (event) => event !== AdminTimetableActivityType.SpecialEvent,
  );
  weekDayList: AdminTimetableWeekDay[] = Object.values(AdminTimetableWeekDay);
  addTimetableActivityFormGroup!: FormGroup;
  addingTimetableActivity = false;

  emptyTimetableSig: Signal<boolean> = computed(() => this.groupTimetableActivityListSig().length === 0);

  ngOnInit(): void {
    this.store.init();

    this.addTimetableActivityFormGroup = this.formBuilder.nonNullable.group({
      weekDay: [AdminTimetableWeekDay.Monday, [Validators.required, Validators.minLength(1)]],
      subject: [this.subjectListSig()[0], [Validators.required, Validators.minLength(1)]],
      timetableActivity: [{}, [Validators.required, Validators.minLength(1)]],
    });

    this.addTimetableActivityFormGroup.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const foundTimetableActivities = this.store
        .selectTimetableActivityListBySubjectIdAndWeekDay(
          this.addTimetableActivityFormGroup.controls['subject'].value,
          this.addTimetableActivityFormGroup.controls['weekDay'].value,
        )()
        .filter((timetableActivity) => !timetableActivity.cohortIds.includes(this.groupIdSig()));

      this.foundActivityListSig.set(foundTimetableActivities);
    });
  }

  getSubjectShortNameById(subjectId: string): string {
    return this.store.getSubjectById(subjectId)()?.shortName ?? '';
  }

  getRoomNameById(roomId: string): string {
    return this.store.getRoomById(roomId)()?.name ?? '';
  }

  displayError = (control: AbstractControl | null) => this.formErrorMessage.displayFormErrorMessage(control);

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
    const timetableActivity = this.addTimetableActivityFormGroup.controls['timetableActivity'].value as AdminTimetableActivity | null;

    if (!timetableActivity?.id) {
      return;
    }

    this.store.addCohortToActivity(this.groupIdSig(), timetableActivity.id);
    this.addTimetableActivityFormGroup.reset();
    this.addingTimetableActivity = false;
  }

  onRemoveTimetableActivity(deletedTimetableActivityId: string): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to delete this activity?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.store.removeCohortFromActivity(this.groupIdSig(), deletedTimetableActivityId);
        }
      });
  }
}
