import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TimeTableItemLecagy } from '@free-spot/models';
import { AdminRoomCardComponent } from '../admin-room-card/admin-room-card.component';
import { AdminRoomService } from '@free-spot-service/room';
import { WeekDay } from '@free-spot/enums';
import { AddItemCardComponent } from '@free-spot/ui';
import { AdminFloorService } from '@free-spot-service/floor';
import { AppDateService } from '@free-spot-service/app-date';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { FormErrorMessage } from '@free-spot/util';
import { RoomCardVM, toRoomCardVM } from '@free-spot-presentation/room';
import { CreateRoomCmd, Room, UpdateRoomCmd } from '@free-spot-domain/room';

@Component({
  selector: 'free-spot-admin-floor-detail',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AdminRoomCardComponent,
    AddItemCardComponent
  ],
  templateUrl: './admin-floor-detail.component.html',
  styleUrl: './admin-floor-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFloorDetailComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);
  private _appDateService: AppDateService = inject(AppDateService);

  editRoom = viewChild.required<ElementRef>('editRoom');
  floorIdSig = input.required<string>();
  readonly floorSig = computed(() => this._adminFloorService.getSignalById(this.floorIdSig())());
  readonly editingRoomIdSig: WritableSignal<string | null> = signal<string | null>(null);
  readonly editingRoomSig: Signal<Room | null> = computed(() => {
    const id = this.editingRoomIdSig();
    if (!id) return null;
    return this.floorRoomListSig().find((room: Room) => room.id === id) ?? null;
  });

  addingRoom = false;
  editingRoom = false;
  addRoomFormGroup = this._formBuilder.nonNullable.group({
    roomName: ['', [Validators.required, Validators.minLength(1)]],
    totalSpotsNumber: [0, Validators.required],
    unavailableSpots: [0, Validators.required],
  });
  roomEmptyTimetable: Signal<TimeTableItemLecagy[]> = computed(() => [
    { weekDay: WeekDay.MONDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.MONDAY) },
    { weekDay: WeekDay.TUESDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.TUESDAY) },
    { weekDay: WeekDay.WEDNESDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.WEDNESDAY) },
    { weekDay: WeekDay.THURSDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.THURSDAY) },
    { weekDay: WeekDay.FRIDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.FRIDAY) },
  ]);

  readonly floorRoomListSig: Signal<Room[]> = computed(() => this._adminRoomService.selectRoomsByFloorId(this.floorIdSig())());
  readonly roomCardVMs = computed<RoomCardVM[]>(() => (this.floorRoomListSig()).map(toRoomCardVM));

  ngOnInit(): void {
    this._adminRoomService.init();
    this._adminFloorService.init();
    this._appDateService.init();
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  onAddingRoom(): void {
    this.addRoomFormGroup.reset();
    this.editingRoom = false;
    this.addingRoom = true;
    this.editRoom()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddRoom(): void {
    const newRoom: CreateRoomCmd = {
      buildingId: this.floorSig().buildingId,
      floorId: this.floorIdSig(),
      name: this.addRoomFormGroup.controls['roomName'].value,
      totalSpotsNumber: this.addRoomFormGroup.controls['totalSpotsNumber'].value,
      unavailableSpots: this.addRoomFormGroup.controls['unavailableSpots'].value,
      subjectList: [],
    }

    this._adminRoomService.create(newRoom);
    this.addRoomFormGroup.reset();
    this.addingRoom = false;
    this.editingRoom = false;
  }

  onEditingRoom(roomToEdit: RoomCardVM): void {
    this.editingRoom = true;
    this.editingRoomIdSig.set(roomToEdit.id);
    this.addRoomFormGroup.setValue({
      roomName: roomToEdit.name,
      totalSpotsNumber: roomToEdit.totalSpotsNumber,
      unavailableSpots: roomToEdit.unavailableSpots,
    });
    this.editRoom()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditRoom(): void {
    const id: string | null = this.editingRoomIdSig();
    if (!id) return;

    const updatedRoom: UpdateRoomCmd = {
      name: this.addRoomFormGroup.controls['roomName'].value,
      totalSpotsNumber: this.addRoomFormGroup.controls['totalSpotsNumber'].value,
      unavailableSpots: this.addRoomFormGroup.controls['unavailableSpots'].value,
    }

    this._adminRoomService.update(id, updatedRoom);
    this.addRoomFormGroup.reset();
    this.addingRoom = false;
    this.editingRoom = false;
  }

  onDeleteRoom(deletedRoom: RoomCardVM): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this room?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this._adminRoomService.remove(deletedRoom.id);
          this.addRoomFormGroup.reset();
          this.addingRoom = false;
          this.editingRoom = false;
        }
      });
  }
}
