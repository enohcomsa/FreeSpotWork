import { ChangeDetectionStrategy, Component, input, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloorBookingDrawerComponent } from '../floor-booking-drawer/floor-booking-drawer.component';
import { Floor, Room } from '@free-spot/models';
import { FloorRoomComponent } from '../floor-room/floor-room.component';

@Component({
  selector: 'free-spot-floor-details',
  standalone: true,
  imports: [CommonModule, FloorBookingDrawerComponent, FloorRoomComponent],
  templateUrl: './floor-details.component.html',
  styleUrl: './floor-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorDetailsComponent {
  floorName = input.required<string>();
  toggleStateSig: WritableSignal<boolean> = signal(false);

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
    // freeSpots: 90,
    // busySpots: 20,
    unavailableSpots: 10,
  };

  getRoom(number: number): Room {
    return {
      name: 'Observator 51' + number,
      floorName: 'UTCN Obs ground Floor',
      subjectList: [],
      timetable: [],
      // freeSpots: 50,
      // busySpots: 10,
      unavailableSpots: 5,
      totalSpotsNumber: 10,
    };
  }
  roomExp: Room = {
    name: '513',
    floorName: 'UTCN Obs ground Floor',
    subjectList: [],
    timetable: [],
    // freeSpots: 50,
    // busySpots: 10,
    unavailableSpots: 5,
    totalSpotsNumber: 10,
  };
}
