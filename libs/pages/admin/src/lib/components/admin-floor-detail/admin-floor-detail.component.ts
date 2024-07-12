import { ChangeDetectionStrategy, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Floor, Room } from '@free-spot/models';
import { AdminRoomCardComponent } from '../admin-room-card/admin-room-card.component';

@Component({
  selector: 'free-spot-admin-floor-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AdminRoomCardComponent,
  ],
  templateUrl: './admin-floor-detail.component.html',
  styleUrl: './admin-floor-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFloorDetailComponent {
  private _formBuilder: FormBuilder = inject(FormBuilder);

  editRoom = viewChild.required<ElementRef>('editRoom');

  floorNameSig = input.required<string>();

  addingRoom = false;
  addRoomFormGroup = this._formBuilder.group({
    roomName: [''],
    totalSpotsNumber: [''],
    unavailableSpots: [''],
  });

  roomList: Room[] = [
    this.getRoom(1),
    this.getRoom(2),
    this.getRoom(3),
    this.getRoom(4),
    this.getRoom(5),
    this.getRoom(6),
    this.getRoom(7),
    this.getRoom(8),
    this.getRoom(9),
    this.getRoom(10),
    this.getRoom(11),
    this.getRoom(12),
    this.getRoom(13),
    this.getRoom(14),
    this.getRoom(15),
  ];
  floorExp: Floor = {
    name: 'UTCN Obs ground Floor',
    buildingName: 'Laboratoare Observator',
    roomList: this.roomList,
    totalSpotsNumber: 120,
    freeSpots: 90,
    busySpots: 20,
    unavailableSpots: 10,
  };

  getRoom(number: number): Room {
    return {
      name: 'Observator 51' + number,
      subjectList: [],
      timetable: [],
      freeSpots: 50,
      busySpots: 10,
      unavailableSpots: 5,
      totalSpotsNumber: 10,
    };
  }
  onAddRoom(): void {
    this.addingRoom = false;
  }
  onEditRoom(): void {
    this.editRoom()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}
