import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AdminEventsBuilding,
  AdminEventsRoom,
  AdminEventType,
  AdminSpecialEvent,
  CreateAdminSpecialEventCmd,
  UpdateAdminSpecialEventCmd,
} from '@free-spot/admin-events/domain';
import { FormErrorMessage } from '@free-spot/util';
import { AddItemCardComponent } from '@free-spot/ui';

import { AdminEventCardComponent } from '@free-spot/admin-events/ui';
import { AdminEventsStore } from '@free-spot/admin-events/data-access';

@Component({
  selector: 'free-spot-admin-events',
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AddItemCardComponent,
    MatDatepickerModule,
    MatSelectModule,
    AdminEventCardComponent,
  ],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventsComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _adminEventsStore = inject(AdminEventsStore);
  private _destroyRef = inject(DestroyRef);

  editEvent = viewChild<ElementRef>('editEvent');

  readonly buildingListSig: Signal<AdminEventsBuilding[]> = this._adminEventsStore.buildingListSig;
  readonly eventListSig: Signal<AdminSpecialEvent[]> = this._adminEventsStore.eventListSig;

  specialEventSig: WritableSignal<AdminSpecialEvent> = signal({} as AdminSpecialEvent);

  startHourList: number[] = [8, 10, 12, 14, 16, 18];
  foundRoomListSig: WritableSignal<AdminEventsRoom[]> = signal([]);
  addingEvent = false;
  editingEvent = false;

  addEventFormGroup = this._formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: [new Date(), [Validators.required]],
    startHour: [8, [Validators.required]],
    building: [this.buildingListSig()[0], [Validators.required]],
    room: [{} as AdminEventsRoom, [Validators.required]],
    unavailable: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this._adminEventsStore.init();

    this.addEventFormGroup.controls['building'].valueChanges
      .pipe(
        filter((building): building is AdminEventsBuilding => !!building),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((building: AdminEventsBuilding) => {
        this.foundRoomListSig.set(this._adminEventsStore.selectRoomsByBuildingId(building.id)());
        if (!this.editingEvent) {
          this.addEventFormGroup.controls['room'].reset();
        }
      });
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  getBuildingById(buildingId: string): AdminEventsBuilding | undefined {
    return this._adminEventsStore.getBuildingById(buildingId)();
  }

  getRoomById(roomId: string): AdminEventsRoom | undefined {
    return this._adminEventsStore.getRoomById(roomId)();
  }

  onAddingEvent(): void {
    this.addEventFormGroup.reset();
    this.addingEvent = true;
    this.editingEvent = false;
    this.editEvent()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddEvent(): void {
    const eventDate: Date = this.addEventFormGroup.controls['date'].value;
    eventDate.setHours(this.addEventFormGroup.controls['startHour'].value, 0, 0, 0);

    const newSpecialEvent: CreateAdminSpecialEventCmd = {
      type: AdminEventType.Special,
      name: this.addEventFormGroup.controls['name'].value,
      date: eventDate.toISOString(),
      startHour: this.addEventFormGroup.controls['startHour'].value,
      buildingId: this.addEventFormGroup.controls['building'].value.id,
      roomId: this.addEventFormGroup.controls['room'].value.id,
      reservedSpots: this.addEventFormGroup.controls['unavailable'].value,
    };

    this._adminEventsStore.createEvent(newSpecialEvent);
    this.editingEvent = false;
    this.addingEvent = false;
  }

  onEditingEvent(eventToEdit: AdminSpecialEvent): void {
    const building = this._adminEventsStore.getBuildingById(eventToEdit.buildingId)();
    const room = this._adminEventsStore.getRoomById(eventToEdit.roomId)();

    if (!building || !room) {
      return;
    }


    this.editingEvent = true;
    this.addEventFormGroup.setValue({
      name: eventToEdit.name,
      date: new Date(eventToEdit.date ? new Date(eventToEdit.date) : new Date()),
      startHour: eventToEdit.startHour as number,
      building,
      room,
      unavailable: eventToEdit.reservedSpots as number,
    });

    this.addEventFormGroup.controls['room'].setValue(
      this.foundRoomListSig().filter((room: AdminEventsRoom) => room.id === eventToEdit.roomId)[0]
    );

    this.specialEventSig.set(eventToEdit);
    this.editEvent()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditEvent(): void {
    const eventDate: Date = this.addEventFormGroup.controls['date'].value;
    eventDate.setHours(this.addEventFormGroup.controls['startHour'].value, 0, 0, 0);

    const updatedSpecialEvent: UpdateAdminSpecialEventCmd = {
      type: AdminEventType.Special,
      name: this.addEventFormGroup.controls['name'].value,
      date: eventDate.toISOString(),
      startHour: this.addEventFormGroup.controls['startHour'].value,
      buildingId: this.addEventFormGroup.controls['building'].value.id,
      roomId: this.addEventFormGroup.controls['room'].value.id,
      reservedSpots: this.addEventFormGroup.controls['unavailable'].value,
    };

    this._adminEventsStore.updateEvent(this.specialEventSig().id, updatedSpecialEvent);
    this.addEventFormGroup.reset();
    this.editingEvent = false;
    this.addingEvent = false;
  }

  onDeleteEvent(deletedSpecialEventId: string): void {
    this._adminEventsStore.deleteEvent(deletedSpecialEventId);
    this.editingEvent = false;
    this.addingEvent = false;
  }
}
