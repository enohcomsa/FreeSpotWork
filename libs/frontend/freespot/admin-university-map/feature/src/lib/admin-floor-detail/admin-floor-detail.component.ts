import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminRoomCardComponent } from '@free-spot/admin-university-map/ui';
import { AddItemCardComponent } from '@free-spot/ui';
import { ConfirmModalService } from '@free-spot/core/ui';
import { FormErrorMessage } from '@free-spot/util';

import { AdminUniversityMapStore } from '@free-spot/admin-university-map/data-access';
import {
  AdminUniversityMapRoomVM,
  CreateAdminUniversityMapRoomCmd,
  UpdateAdminUniversityMapRoomCmd,
} from '@free-spot/admin-university-map/domain';

@Component({
  selector: 'free-spot-admin-floor-detail',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AdminRoomCardComponent,
    AddItemCardComponent,
  ],
  templateUrl: './admin-floor-detail.component.html',
  styleUrl: './admin-floor-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFloorDetailComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmService = inject(ConfirmModalService);
  private readonly formErrorMessage = inject(FormErrorMessage);
  private readonly store = inject(AdminUniversityMapStore);

  editRoom = viewChild.required<ElementRef>('editRoom');
  floorIdSig = input.required<string>();

  readonly floorSig = computed(() => this.store.getFloorById(this.floorIdSig())());
  readonly editingRoomIdSig: WritableSignal<string | null> = signal<string | null>(null);
  readonly floorRoomListSig = computed(() => this.store.selectRoomsByFloorId(this.floorIdSig())());
  readonly roomCardVMs = computed(() => this.store.selectRoomVMsByFloorId(this.floorIdSig())());

  addingRoom = false;
  editingRoom = false;

  addRoomFormGroup = this.formBuilder.nonNullable.group({
    roomName: ['', [Validators.required, Validators.minLength(1)]],
    totalSpotsNumber: [0, Validators.required],
    unavailableSpots: [0, Validators.required],
  });

  ngOnInit(): void {
    this.store.init();
  }

  displayError = (control: AbstractControl | null) =>
    this.formErrorMessage.displayFormErrorMessage(control);

  onAddingRoom(): void {
    this.addRoomFormGroup.reset();
    this.editingRoom = false;
    this.addingRoom = true;
    this.editRoom()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddRoom(): void {
    const floor = this.floorSig();

    if (!floor) {
      return;
    }

    const newRoom: CreateAdminUniversityMapRoomCmd = {
      buildingId: floor.buildingId,
      floorId: this.floorIdSig(),
      name: this.addRoomFormGroup.controls.roomName.value,
      totalSpotsNumber: this.addRoomFormGroup.controls.totalSpotsNumber.value,
      unavailableSpots: this.addRoomFormGroup.controls.unavailableSpots.value,
      subjectList: [],
    };

    this.store.createRoom(newRoom);
    this.addRoomFormGroup.reset();
    this.addingRoom = false;
    this.editingRoom = false;
  }

  onEditingRoom(roomToEdit: AdminUniversityMapRoomVM): void {
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
    const id = this.editingRoomIdSig();

    if (!id) {
      return;
    }

    const updatedRoom: UpdateAdminUniversityMapRoomCmd = {
      name: this.addRoomFormGroup.controls.roomName.value,
      totalSpotsNumber: this.addRoomFormGroup.controls.totalSpotsNumber.value,
      unavailableSpots: this.addRoomFormGroup.controls.unavailableSpots.value,
    };

    this.store.updateRoom(id, updatedRoom);
    this.addRoomFormGroup.reset();
    this.addingRoom = false;
    this.editingRoom = false;
  }

  onDeleteRoom(deletedRoom: AdminUniversityMapRoomVM): void {
    this.confirmService
      .openConfirmDialog('Are you sure you want to delete this room?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.store.removeRoom(deletedRoom.id);
          this.addRoomFormGroup.reset();
          this.addingRoom = false;
          this.editingRoom = false;
        }
      });
  }
}
