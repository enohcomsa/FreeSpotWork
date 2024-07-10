import { ChangeDetectionStrategy, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Floor, Building } from '@free-spot/models';
import { AdminFloorCardComponent } from '../admin-floor-card/admin-floor-card.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  ],
  templateUrl: './admin-building-detail.component.html',
  styleUrl: './admin-building-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBuildingDetailComponent {
  private _formBuilder: FormBuilder = inject(FormBuilder);

  editFloor = viewChild<ElementRef>('editFloor');

  buildingNameSig = input.required<string>();

  addingFloor = false;
  addFloorFormControl = this._formBuilder.control('');

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

  onAddFloor(): void {
    this.addingFloor = false;
  }
  onEditFloor(): void {
    this.editFloor()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}
