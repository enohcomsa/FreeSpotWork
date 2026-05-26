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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminEventsStore } from '@free-spot/admin-events/data-access';
import {
  type AdminEventsBuilding,
  type AdminEventsRoom,
  type AdminSpecialEvent,
  type CreateAdminSpecialEventCmd,
  type UpdateAdminSpecialEventCmd,
} from '@free-spot/admin-events/domain';
import { AdminEventCardComponent } from '@free-spot/admin-events/ui';
import { AddItemCardComponent } from '@free-spot/shared/ui';
import { FormErrorMessage } from  '@free-spot/shared/util';
import { filter } from 'rxjs';

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
  private readonly formBuilder = inject(FormBuilder);
  private readonly formErrorMessage = inject(FormErrorMessage);
  private readonly adminEventsStore = inject(AdminEventsStore);
  private readonly destroyRef = inject(DestroyRef);

  editEvent = viewChild<ElementRef>('editEvent');

  readonly buildingListSig: Signal<AdminEventsBuilding[]> = this.adminEventsStore.buildingListSig;
  readonly eventListSig: Signal<AdminSpecialEvent[]> = this.adminEventsStore.eventListSig;

  specialEventSig: WritableSignal<AdminSpecialEvent | null> = signal(null);

  readonly startHourList: number[] = [8, 10, 12, 14, 16, 18];

  foundRoomListSig: WritableSignal<AdminEventsRoom[]> = signal([]);
  addingEvent = false;
  editingEvent = false;

  addEventFormGroup = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: [new Date(), [Validators.required]],
    startHour: [8, [Validators.required]],
    building: [{} as AdminEventsBuilding, [Validators.required]],
    room: [{} as AdminEventsRoom, [Validators.required]],
    unavailable: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this.adminEventsStore.init();

    this.addEventFormGroup.controls.building.valueChanges
      .pipe(
        filter((building): building is AdminEventsBuilding => !!building?.id),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((building) => {
        this.foundRoomListSig.set(this.adminEventsStore.selectRoomsByBuildingId(building.id)());

        if (!this.editingEvent) {
          this.addEventFormGroup.controls.room.reset();
        }
      });
  }

  displayError = (control: AbstractControl | null): string => this.formErrorMessage.displayFormErrorMessage(control);

  getBuildingById(buildingId: string): AdminEventsBuilding | undefined {
    return this.adminEventsStore.getBuildingById(buildingId)();
  }

  getRoomById(roomId: string): AdminEventsRoom | undefined {
    return this.adminEventsStore.getRoomById(roomId)();
  }

  onAddingEvent(): void {
    this.addEventFormGroup.reset();
    this.addingEvent = true;
    this.editingEvent = false;
    this.specialEventSig.set(null);
    this.editEvent()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddEvent(): void {
    const eventDate = this.toEventDate();

    const newSpecialEvent: CreateAdminSpecialEventCmd = {
      type: 'SPECIAL',
      name: this.addEventFormGroup.controls.name.value,
      date: eventDate.toISOString(),
      startHour: this.addEventFormGroup.controls.startHour.value,
      buildingId: this.addEventFormGroup.controls.building.value.id,
      roomId: this.addEventFormGroup.controls.room.value.id,
      reservedSpots: this.addEventFormGroup.controls.unavailable.value,
    };

    this.adminEventsStore.createEvent(newSpecialEvent);
    this.resetFormState();
  }

  onEditingEvent(eventToEdit: AdminSpecialEvent): void {
    const building = this.adminEventsStore.getBuildingById(eventToEdit.buildingId)();
    const room = this.adminEventsStore.getRoomById(eventToEdit.roomId)();

    if (!building || !room) {
      return;
    }

    this.editingEvent = true;
    this.addingEvent = true;
    this.foundRoomListSig.set(this.adminEventsStore.selectRoomsByBuildingId(building.id)());

    this.addEventFormGroup.setValue({
      name: eventToEdit.name,
      date: new Date(eventToEdit.date),
      startHour: eventToEdit.startHour,
      building,
      room,
      unavailable: eventToEdit.reservedSpots,
    });

    this.specialEventSig.set(eventToEdit);
    this.editEvent()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditEvent(): void {
    const specialEvent = this.specialEventSig();

    if (!specialEvent) {
      return;
    }

    const eventDate = this.toEventDate();

    const updatedSpecialEvent: UpdateAdminSpecialEventCmd = {
      type: 'SPECIAL',
      name: this.addEventFormGroup.controls.name.value,
      date: eventDate.toISOString(),
      startHour: this.addEventFormGroup.controls.startHour.value,
      buildingId: this.addEventFormGroup.controls.building.value.id,
      roomId: this.addEventFormGroup.controls.room.value.id,
      reservedSpots: this.addEventFormGroup.controls.unavailable.value,
    };

    this.adminEventsStore.updateEvent(specialEvent.id, updatedSpecialEvent);
    this.resetFormState();
  }

  onDeleteEvent(deletedSpecialEventId: string): void {
    this.adminEventsStore.deleteEvent(deletedSpecialEventId);
    this.resetFormState();
  }

  private toEventDate(): Date {
    const eventDate = new Date(this.addEventFormGroup.controls.date.value);

    eventDate.setHours(this.addEventFormGroup.controls.startHour.value, 0, 0, 0);

    return eventDate;
  }

  private resetFormState(): void {
    this.addEventFormGroup.reset();
    this.specialEventSig.set(null);
    this.editingEvent = false;
    this.addingEvent = false;
  }
}
