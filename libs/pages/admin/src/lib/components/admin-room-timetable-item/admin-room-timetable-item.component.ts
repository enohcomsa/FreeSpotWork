import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Event, WeekDay, WeekParity } from '@free-spot/enums';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { FormErrorMessage } from '@free-spot/util';
import { CreateTimetableActivityCmd, TimetableActivity } from '@free-spot-domain/timetable-activity';
import { Room } from '@free-spot-domain/room';
import { AdminRoomService } from '@free-spot-service/room';
import { SubjectItem } from '@free-spot-domain/subject';
import { TimetableActivityCardVM } from '@free-spot-presentation/timetable-activity-card';
import { AdminTimetableActivityService } from '@free-spot-service/timetable-activity';

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
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _adminTimetableActivityService: AdminTimetableActivityService = inject(AdminTimetableActivityService);

  roomIdSig = input.required<string>();
  day = input.required<WeekDay>();
  subjectListSig = input.required<SubjectItem[]>();
  dayTimetableActivityCardVMListSig = input.required<TimetableActivityCardVM[]>();

  readonly timetableActivityListSig: Signal<TimetableActivity[]> = computed(() => this._adminTimetableActivityService.getTimetableActivityListSignalByRoomId(this.roomIdSig())());
  roomSig: Signal<Room> = computed(() => this._adminRoomService.getSignalById(this.roomIdSig())());
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
    const newTimetableActivityCmd: CreateTimetableActivityCmd = {
      roomId: this.roomIdSig(),
      subjectId: this.addTimetableActivityFormGroup.controls['subjectName'].value.id,
      date: new Date().toISOString(),
      weekDay: this.day(),
      activityType: this.addTimetableActivityFormGroup.controls['activityType'].value,
      cohortIds: [],
      startHour: this.addTimetableActivityFormGroup.controls['startHour'].value,
      endHour: this.addTimetableActivityFormGroup.controls['startHour'].value + 2,
      weekParity: this.addTimetableActivityFormGroup.controls['weekParity'].value,
      capacity: this.roomSig().totalSpotsNumber - this.roomSig().unavailableSpots,
      reservedSpots: 0,
      busySpots: 0,
      freeSpots: this.roomSig().totalSpotsNumber - this.roomSig().unavailableSpots,
    }

    this._adminTimetableActivityService.create(newTimetableActivityCmd);
    this.addTimetableActivityFormGroup.reset();
    this.addingTimetableActivity = false;
  }

  onRemoveTimetableActivity(removedTimetableActivityId: string): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this activity?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this._adminTimetableActivityService.remove(removedTimetableActivityId);
        }
      });
  }
}
