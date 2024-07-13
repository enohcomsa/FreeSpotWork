import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, viewChild } from '@angular/core';
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

  roomEmptyTimetable: TimeTableItem[] = [
    { weekDay: WeekDay.MONDAY, activities: [] },
    { weekDay: WeekDay.TUESDAY, activities: [] },
    { weekDay: WeekDay.WEDNESDAY, activities: [] },
    { weekDay: WeekDay.THURSDAY, activities: [] },
    { weekDay: WeekDay.FRIDAY, activities: [] },
  ];

  editRoom = viewChild.required<ElementRef>('editRoom');

  floorNameSig = input.required<string>();

  addingRoom = false;
  addRoomFormGroup = this._formBuilder.nonNullable.group({
    roomName: [''],
    totalSpotsNumber: [0],
    unavailableSpots: [0],
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

  ngOnInit(): void {
    this._adminRoomService.init();
  }

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

  onCreateRoom(): void {
    this.addingRoom = true;
    this.editRoom()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  onAddRoom(): void {
    // console.log(
    //   this._createRoom(
    //     this.addRoomFormGroup.controls['roomName'].value as string,
    //     this.addRoomFormGroup.controls['totalSpotsNumber'].value as number,
    //     this.addRoomFormGroup.controls['unavailableSpots'].value as number,
    //   ),
    // );

    this._adminRoomService.addRoom(
      this._createRoom(
        this.addRoomFormGroup.controls['roomName'].value as string,
        this.addRoomFormGroup.controls['totalSpotsNumber'].value as number,
        this.addRoomFormGroup.controls['unavailableSpots'].value as number,
      ),
    );
    this.addRoomFormGroup.reset();
    this.addingRoom = false;
  }

  onEditRoom(): void {
    this.editRoom()?.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
}
