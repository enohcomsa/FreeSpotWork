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
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Floor, Room, TimeTableItem } from '@free-spot/models';
import { AdminRoomCardComponent } from '../admin-room-card/admin-room-card.component';
import { AdminRoomService } from '@free-spot-service/room';
import { WeekDay } from '@free-spot/enums';
import { AddItemCardComponent } from '@free-spot/ui';
import { AdminFloorService } from '@free-spot-service/floor';

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
    AddItemCardComponent,
  ],
  templateUrl: './admin-floor-detail.component.html',
  styleUrl: './admin-floor-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFloorDetailComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);

  editRoom = viewChild.required<ElementRef>('editRoom');
  floorNameSig = input.required<string>();
  floorSig!: Signal<Floor>;
  oldRoomSig: WritableSignal<Room> = signal({} as Room);

  addingRoom = false;
  editingRoom = false;
  addRoomFormGroup = this._formBuilder.nonNullable.group({
    roomName: [''],
    totalSpotsNumber: [0],
    unavailableSpots: [0],
  });
  roomEmptyTimetable: TimeTableItem[] = [
    { weekDay: WeekDay.MONDAY, activities: [] },
    { weekDay: WeekDay.TUESDAY, activities: [] },
    { weekDay: WeekDay.WEDNESDAY, activities: [] },
    { weekDay: WeekDay.THURSDAY, activities: [] },
    { weekDay: WeekDay.FRIDAY, activities: [] },
  ];

  ngOnInit(): void {
    this._adminRoomService.init();
    this._adminFloorService.init();
    this.floorSig = this._adminFloorService.getFloorByName(this.floorNameSig());
  }

  onAddingRoom(): void {
    this.addRoomFormGroup.reset();
    this.editingRoom = false;
    this.addingRoom = true;
    this.editRoom()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddRoom(): void {
    const newRoom: Room = this._createRoom(
      this.addRoomFormGroup.controls['roomName'].value as string,
      this.addRoomFormGroup.controls['totalSpotsNumber'].value as number,
      this.addRoomFormGroup.controls['unavailableSpots'].value as number,
    );
    const updatedFloor: Floor = this._createNewRoomFloor(newRoom);

    this._adminRoomService.addRoom(newRoom);
    this._adminFloorService.updateFloor(this.floorSig(), updatedFloor);
    this.addRoomFormGroup.reset();
    this.addingRoom = false;
    this.editingRoom = false;
  }

  onEditingRoom(roomToEdit: Room): void {
    this.editingRoom = true;
    this.oldRoomSig.set(roomToEdit);
    this.addRoomFormGroup.setValue({
      roomName: roomToEdit.name,
      totalSpotsNumber: roomToEdit.totalSpotsNumber,
      unavailableSpots: roomToEdit.unavailableSpots,
    });
    this.editRoom()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onEditRoom(): void {
    const newRoom: Room = {
      ...this._createRoom(
        this.addRoomFormGroup.controls['roomName'].value as string,
        this.addRoomFormGroup.controls['totalSpotsNumber'].value as number,
        this.addRoomFormGroup.controls['unavailableSpots'].value as number,
      ),
      subjectList: this.oldRoomSig().subjectList,
      timetable: this.oldRoomSig().timetable,
    };
    const diffRoom: Room = {
      ...this.oldRoomSig(),
      totalSpotsNumber: newRoom.totalSpotsNumber - (this.oldRoomSig().totalSpotsNumber as number),
      freeSpots: newRoom.freeSpots - (this.oldRoomSig().freeSpots as number),
      busySpots: newRoom.busySpots - (this.oldRoomSig().busySpots as number),
      unavailableSpots: newRoom.unavailableSpots - (this.oldRoomSig().unavailableSpots as number),
    };
    const updatedFloor: Floor = this._createEditRoomFloor(diffRoom, newRoom);

    this._adminRoomService.updateRoom(this.oldRoomSig() as Room, newRoom);
    this._adminFloorService.updateFloor(this.floorSig(), updatedFloor);
    this.addRoomFormGroup.reset();
    this.addingRoom = false;
    this.editingRoom = false;
  }

  onDeleteRoom(deletedRoom: Room): void {
    const diffRoom: Room = {
      ...this.oldRoomSig(),
      totalSpotsNumber: -deletedRoom.totalSpotsNumber,
      freeSpots: -deletedRoom.freeSpots,
      busySpots: -deletedRoom.busySpots,
      unavailableSpots: -deletedRoom.unavailableSpots,
    };
    const updatedFloor: Floor = this._createDeleteRoomFloor(diffRoom, deletedRoom);

    this._adminRoomService.deleteRoom(deletedRoom);
    this._adminFloorService.updateFloor(this.floorSig(), updatedFloor);
    this.addRoomFormGroup.reset();
    this.addingRoom = false;
    this.editingRoom = false;
  }

  private _createRoom(roomName: string, totalSpotsNumber: number, unavailableSpots: number): Room {
    return {
      name: roomName,
      subjectList: [],
      timetable: this.roomEmptyTimetable,
      totalSpotsNumber: totalSpotsNumber,
      freeSpots: totalSpotsNumber - unavailableSpots,
      busySpots: 0,
      unavailableSpots: unavailableSpots,
    };
  }

  private _createNewRoomFloor(addedRoom: Room): Floor {
    return {
      ...this.floorSig(),
      roomList: this.floorSig().roomList ? [...this.floorSig().roomList, addedRoom] : [addedRoom],
      totalSpotsNumber: this._reduceSpotNumber('totalSpotsNumber', addedRoom),
      freeSpots: this._reduceSpotNumber('freeSpots', addedRoom),
      busySpots: this._reduceSpotNumber('busySpots', addedRoom),
      unavailableSpots: this._reduceSpotNumber('unavailableSpots', addedRoom),
    };
  }

  private _createEditRoomFloor(diffRoom: Room, newRoom: Room): Floor {
    return {
      ...this.floorSig(),
      roomList: this.floorSig().roomList.map((room: Room) => (room === this.oldRoomSig() ? newRoom : room)),
      totalSpotsNumber: this._reduceSpotNumber('totalSpotsNumber', diffRoom),
      freeSpots: this._reduceSpotNumber('freeSpots', diffRoom),
      busySpots: this._reduceSpotNumber('busySpots', diffRoom),
      unavailableSpots: this._reduceSpotNumber('unavailableSpots', diffRoom),
    };
  }
  private _createDeleteRoomFloor(diffRoom: Room, deletedRoom: Room): Floor {
    return {
      ...this.floorSig(),
      roomList: this.floorSig().roomList.filter((room: Room) => room !== deletedRoom),
      totalSpotsNumber: this._reduceSpotNumber('totalSpotsNumber', diffRoom),
      freeSpots: this._reduceSpotNumber('freeSpots', diffRoom),
      busySpots: this._reduceSpotNumber('busySpots', diffRoom),
      unavailableSpots: this._reduceSpotNumber('unavailableSpots', diffRoom),
    };
  }

  private _reduceSpotNumber(spotType: keyof Omit<Room, 'subjectList' | 'name' | 'timetable'>, newRoom?: Room): number {
    if (this.floorSig().roomList) {
      const totalNumber: number = this.floorSig().roomList.reduce<number>(
        (totalNumber: number, room: Room) => (totalNumber += room[spotType]),
        0,
      );
      return totalNumber + (newRoom ? newRoom[spotType] : 0);
    } else {
      return newRoom ? newRoom[spotType] : 0;
    }
  }
}
