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

import { Building } from '@free-spot-domain/building';
import { CreateSpecialEventCmd, EventType, SpecialEvent, UpdateSpecialEventCmd } from '@free-spot-domain/event';
import { Room } from '@free-spot-domain/room';
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

  readonly buildingListSig: Signal<Building[]> = this._adminEventsStore.buildingListSig;
  readonly eventListSig: Signal<SpecialEvent[]> = this._adminEventsStore.eventListSig;

  specialEventSig: WritableSignal<SpecialEvent> = signal({} as SpecialEvent);

  startHourList: number[] = [8, 10, 12, 14, 16, 18];
  foundRoomListSig: WritableSignal<Room[]> = signal([]);
  addingEvent = false;
  editingEvent = false;

  addEventFormGroup = this._formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: [new Date(), [Validators.required]],
    startHour: [8, [Validators.required]],
    building: [this.buildingListSig()[0], [Validators.required]],
    room: [{} as Room, [Validators.required]],
    unavailable: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this._adminEventsStore.init();

    this.addEventFormGroup.controls['building'].valueChanges
      .pipe(
        filter((building): building is Building => !!building),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((building: Building) => {
        this.foundRoomListSig.set(this._adminEventsStore.selectRoomsByBuildingId(building.id)());
        if (!this.editingEvent) {
          this.addEventFormGroup.controls['room'].reset();
        }
      });
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  getBuildingById(buildingId: string): Building {
    return this._adminEventsStore.getBuildingById(buildingId)();
  }

  getRoomById(roomId: string): Room {
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

    const newSpecialEvent: CreateSpecialEventCmd = {
      type: EventType.SPECIAL,
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

  onEditingEvent(eventToEdit: SpecialEvent): void {
    this.editingEvent = true;
    this.addEventFormGroup.setValue({
      name: eventToEdit.name,
      date: new Date(eventToEdit.date ? new Date(eventToEdit.date) : new Date()),
      startHour: eventToEdit.startHour as number,
      building: this._adminEventsStore.getBuildingById(eventToEdit.buildingId)(),
      room: this._adminEventsStore.getRoomById(eventToEdit.roomId)(),
      unavailable: eventToEdit.reservedSpots as number,
    });

    this.addEventFormGroup.controls['room'].setValue(
      this.foundRoomListSig().filter((room: Room) => room.id === eventToEdit.roomId)[0]
    );

    this.specialEventSig.set(eventToEdit);
    this.editEvent()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditEvent(): void {
    const eventDate: Date = this.addEventFormGroup.controls['date'].value;
    eventDate.setHours(this.addEventFormGroup.controls['startHour'].value, 0, 0, 0);

    const updatedSpecialEvent: UpdateSpecialEventCmd = {
      type: EventType.SPECIAL,
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
