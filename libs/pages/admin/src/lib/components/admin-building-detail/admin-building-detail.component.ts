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
import { AdminFloorCardComponent } from '../admin-floor-card/admin-floor-card.component';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddItemCardComponent } from '@free-spot/ui';
import { BuildingService } from '@free-spot-service/building';
import { AdminFloorService } from '@free-spot-service/floor';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { FormErrorMessage } from '@free-spot/util';
import { CreateFloorCmd, Floor, UpdateFloorCmd } from '@free-spot-domain/floor';
import { FloorCardVM, toFloorCardVM } from '@free-spot-presentation/floor';
import { AdminRoomService } from '@free-spot-service/room';

@Component({
  selector: 'free-spot-admin-building-detail',

  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AdminFloorCardComponent,
    AddItemCardComponent
  ],
  templateUrl: './admin-building-detail.component.html',
  styleUrl: './admin-building-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBuildingDetailComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminBuildingService: BuildingService = inject(BuildingService);

  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);

  editFloor = viewChild<ElementRef>('editFloor');
  buildingIdSig = input.required<string>();
  readonly buildingSig = computed(() => this._adminBuildingService.getSignalById(this.buildingIdSig())());
  readonly editingFloorIdSig: WritableSignal<string | null> = signal<string | null>(null);
  readonly editingFloorSig: Signal<Floor | null> = computed(() => {
    const id = this.editingFloorIdSig();
    if (!id) return null;
    return this.buildingFloorList().find((floor: Floor) => floor.id === id) ?? null;
  });

  addingFloor = false;
  editingFloor = false;
  addFloorFormControl = this._formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(3)]);
  readonly buildingFloorList: Signal<Floor[]> = computed(() => this._adminFloorService.selectFloorsByBuildingId(this.buildingIdSig())());
  readonly floorCardVMs = computed<FloorCardVM[]>(() => this.buildingFloorList().map((floorVM: Floor) => ({
    ...toFloorCardVM(floorVM),
    roomsCount: this._adminRoomService.selectRoomsByFloorId(floorVM.id)().length,
  })));


  ngOnInit(): void {
    this._adminRoomService.init();
    this._adminFloorService.init();
    this._adminBuildingService.init();
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

  onAddingFloor(): void {
    this.addFloorFormControl.reset();
    this.editingFloor = false;
    this.addingFloor = true;
    this.editFloor()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddFloor(): void {
    // const newFloor: FloorLegacy = this._createFloor(this.addFloorFormControl.value);
    const newFloor: CreateFloorCmd = {
      buildingId: this.buildingIdSig(),
      name: this.addFloorFormControl.value,
    }

    // const updatedBuilding: BuildingLegacy = {
    //   ...this.buildingSig(),
    //   floorList: this.buildingSig().floorList ? [...this.buildingSig().floorList, newFloor] : [newFloor],
    // };

    this._adminFloorService.create(newFloor);
    this.addFloorFormControl.reset();
    // this._adminBuildingService.updateBuilding(this.buildingSig(), updatedBuilding);
    this.addingFloor = false;
    this.editingFloor = false;
  }

  onEditingFloor(floorToEdit: FloorCardVM): void {
    this.editingFloor = true;
    this.editingFloorIdSig.set(floorToEdit.id);
    this.addFloorFormControl.setValue(floorToEdit.name);
    this.editFloor()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditFloor(): void {
    const id: string | null = this.editingFloorIdSig()
    if (!id) return;

    const updatedFloor: UpdateFloorCmd = {
      name: this.addFloorFormControl.value
    };

    this._adminFloorService.update(id, updatedFloor);
    this.addFloorFormControl.reset();
    this.editingFloor = false;
    this.addingFloor = false;
  }

  onDeleteFloor(deletedFloor: FloorCardVM): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this floor?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          // const updatedBuilding: BuildingLegacy = {
          //   ...this.buildingSig(),
          //   floorList: this.buildingSig().floorList.filter((floor: FloorLegacy) => floor !== deletedFloor),
          // };
          this._adminFloorService.remove(deletedFloor.id);
          // this._adminBuildingService.updateBuilding(this.buildingSig(), updatedBuilding);
          this.addFloorFormControl.reset();
          this.editingFloor = false;
          this.addingFloor = false;
        }
      });
  }

  // private _createFloor(floorName: string): FloorLegacy {
  //   return {
  //     name: floorName,
  //     buildingName: this.buildingNameSig(),
  //     roomList: [],
  //     totalSpotsNumber: 0,
  //     unavailableSpots: 0,
  //   };
  // }
}
