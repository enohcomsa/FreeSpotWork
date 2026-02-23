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
import { FreeSpotUser } from '@free-spot/models';
import { ActivityType, WeekDay } from '@free-spot/enums';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminRoomService } from '@free-spot-service/room';
import { debounceTime } from 'rxjs';
import { BookingService } from '@free-spot-service/booking';
import { UserService } from '@free-spot-service/user';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { FormErrorMessage } from '@free-spot/util';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';
import { TimetableActivity } from '@free-spot-domain/timetable-activity';
import { SubjectService } from '@free-spot-service/subject';

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
    MatTooltipModule
  ],
  templateUrl: './admin-group-timetable.component.html',
  styleUrl: './admin-group-timetable.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGroupTimetableComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _userService: UserService = inject(UserService);
  private _bookingService: BookingService = inject(BookingService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _adminSubjectService: SubjectService = inject(SubjectService);
  private _adminTimetableActivityService: AdminTimetableActivityService = inject(AdminTimetableActivityService);


  protected groupTimetableActivityListSig: Signal<TimetableActivity[]> = computed(() => this._adminTimetableActivityService.selectTimetableActivityListSignalByCohortId(this.groupIdSig())());
  userListSig: Signal<FreeSpotUser[]> = this._userService.userListSig;
  groupIdSig = input.required<string>();
  subjectListSig = input.required<string[]>();
  foundActivityListSig: WritableSignal<TimetableActivity[]> = signal([]);

  startHourList: number[] = [8, 10, 12, 14, 16, 18];
  activityTypeList: ActivityType[] = Object.values(ActivityType).filter((event: ActivityType) => event !== ActivityType.SPECIAL_EVENT);
  weekDayList: WeekDay[] = Object.values(WeekDay);
  addTimetableActivityFormGroup!: FormGroup;
  addingTimetableActivity = false;

  emptyTimetableSig: Signal<boolean> = computed(() => {
    return this._adminTimetableActivityService.selectTimetableActivityListSignalByCohortId(this.groupIdSig())()?.length === 0;
  });

  ngOnInit(): void {
    this._adminTimetableActivityService.init();
    this._bookingService.init();
    this._userService.init();
    this._adminSubjectService.init();
    this._adminRoomService.init();

    this.addTimetableActivityFormGroup = this._formBuilder.nonNullable.group({
      weekDay: [WeekDay.MONDAY, [Validators.required, Validators.minLength(1)]],
      subject: [this.subjectListSig()[0], [Validators.required, Validators.minLength(1)]],
      timetableActivity: [{}, [Validators.required, Validators.minLength(1)]],
    });

    this.addTimetableActivityFormGroup.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const foundTimetableActivities: TimetableActivity[] = this._adminTimetableActivityService
        .selectTimetableActivityListSignalBysubjectIdAndWeekDay(
          this.addTimetableActivityFormGroup.controls['subject'].value,
          this.addTimetableActivityFormGroup.controls['weekDay'].value,
        )().filter((timetableActivity: TimetableActivity) => !timetableActivity.cohortIds.includes(this.groupIdSig()));

      this.foundActivityListSig.set(foundTimetableActivities);
    });
  }

  getSubjectShortNameById(subjectId: string): string {
    return this._adminSubjectService.getSignalById(subjectId)().shortName;
  }

  getRoomNameById(roomId: string): string {
    return this._adminRoomService.getSignalById(roomId)().name;
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  displaySubject = (subjectId?: string | null): string => subjectId ? this.getSubjectShortNameById(subjectId) : '';

  displayTimetableActivity = (timetableActivity?: TimetableActivity | null): string => {
    if (!timetableActivity?.id) return '';

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
    if (this.groupIdSig() !== undefined) {
      const timetableActivityId = this.addTimetableActivityFormGroup.controls['timetableActivity'].value.id;

      this._adminTimetableActivityService.addCohortToActivity(this.groupIdSig(), timetableActivityId);
    }

    this.addTimetableActivityFormGroup.reset();
    this.addingTimetableActivity = false;
  }

  onRemoveTimetableActivity(deletedTimetableActivityId: string): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this activity?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this._adminTimetableActivityService.removeCohortFromAcitvity(this.groupIdSig(), deletedTimetableActivityId);
        }
      });
  }
}
