import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Floor, Building } from '@free-spot/models';
import { AdminFloorCardComponent } from '../admin-floor-card/admin-floor-card.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddItemCardComponent } from '@free-spot/ui';
import { AdminBuildingService } from '@free-spot-service/building';
import { AdminFloorService } from '@free-spot-service/floor';

@Component({
  selector: 'free-spot-admin-building-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AdminFloorCardComponent,
    AddItemCardComponent,
  ],
  templateUrl: './admin-building-detail.component.html',
  styleUrl: './admin-building-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBuildingDetailComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  private _adminBuildingService: AdminBuildingService = inject(AdminBuildingService);

  editFloor = viewChild<ElementRef>('editFloor');
  buildingNameSig = input.required<string>();
  buildingSig!: Signal<Building>;
  oldFloorSig: WritableSignal<Floor> = signal({} as Floor);

  addingFloor = false;
  editingFloor = false;
  addFloorFormControl = this._formBuilder.nonNullable.control('');

  floorExp: Floor = {
    name: 'UTCN Obs ground Floor',
    buildingName: 'Laboratoare Observator',
    roomList: [],
    totalSpotsNumber: 120,
    freeSpots: 90,
    busySpots: 20,
    unavailableSpots: 10,
  };
  floorExp2: Floor = {
    name: '328',
    buildingName: 'Laboratoare Observator',
    roomList: [],
    totalSpotsNumber: 90,
    freeSpots: 50,
    busySpots: 30,
    unavailableSpots: 10,
  };
  buildig: Building = {
    name: 'Laboratoare Observator',
    adress: 'Observatorului, 400347',
    floorList: [this.floorExp, this.floorExp2],
    specialEvent: false,
  };

  ngOnInit(): void {
    this._adminFloorService.init();
    this._adminBuildingService.init();
    this.buildingSig = this._adminBuildingService.getBuildingByName(this.buildingNameSig());
  }

  onAddingFloor(): void {
    this.addFloorFormControl.reset();
    this.editingFloor = false;
    this.addingFloor = true;
    this.editFloor()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddFloor(): void {
    const newFloor: Floor = this._createFloor(this.addFloorFormControl.value);
    const updatedBuilding: Building = {
      ...this.buildingSig(),
      floorList: this.buildingSig().floorList ? [...this.buildingSig().floorList, newFloor] : [newFloor],
    };
    this._adminFloorService.addFloor(newFloor);
    this._adminBuildingService.updateBuilding(this.buildingSig(), updatedBuilding);
    this.addingFloor = false;
    this.editingFloor = false;
  }

  onEditingFloor(floorToEdit: Floor): void {
    this.editingFloor = true;
    this.oldFloorSig.set(floorToEdit);
    this.addFloorFormControl.setValue(floorToEdit.name);
    this.editFloor()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditFloor(): void {
    const newFloor: Floor = { ...this.oldFloorSig(), name: this.addFloorFormControl.value };
    const updatedBuilding: Building = {
      ...this.buildingSig(),
      floorList: this.buildingSig().floorList.map((floor: Floor) => (floor === this.oldFloorSig() ? newFloor : floor)),
    };

    this._adminFloorService.updateFloor(this.oldFloorSig(), newFloor);
    this._adminBuildingService.updateBuilding(this.buildingSig(), updatedBuilding);
    this.addFloorFormControl.reset();
    this.editingFloor = false;
    this.addingFloor = false;
  }

  onDeleteFloor(deletedFloor: Floor): void {
    const updatedBuilding: Building = {
      ...this.buildingSig(),
      floorList: this.buildingSig().floorList.filter((floor: Floor) => floor !== deletedFloor),
    };
    this._adminFloorService.deleteFloor(deletedFloor);
    this._adminBuildingService.updateBuilding(this.buildingSig(), updatedBuilding);
    this.addFloorFormControl.reset();
    this.editingFloor = false;
    this.addingFloor = false;
  }

  private _createFloor(floorName: string): Floor {
    return {
      name: floorName,
      buildingName: this.buildingNameSig(),
      roomList: [],
      totalSpotsNumber: 0,
      freeSpots: 0,
      busySpots: 0,
      unavailableSpots: 0,
    };
  }
}
