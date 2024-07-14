import { ChangeDetectionStrategy, Component, inject, input, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicChipListComponent, TimetableItemComponent } from '@free-spot/ui';
import { AdminRoomTimetableItemComponent } from '../admin-room-timetable-item/admin-room-timetable-item.component';
import { SubjectName } from '@free-spot/enums';
import { Building, Floor, Room, TimeTableItem } from '@free-spot/models';
import { AdminRoomService } from '@free-spot-service/room';
import { AdminBuildingService } from '@free-spot-service/building';
import { AdminFloorService } from '@free-spot-service/floor';

@Component({
  selector: 'free-spot-admin-room-detail',
  standalone: true,
  imports: [CommonModule, DynamicChipListComponent, AdminRoomTimetableItemComponent, TimetableItemComponent],
  templateUrl: './admin-room-detail.component.html',
  styleUrl: './admin-room-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomDetailComponent implements OnInit {
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  private _adminBuildingService: AdminBuildingService = inject(AdminBuildingService);

  roomNameSig = input.required<string>();
  roomSig!: Signal<Room>;
  floorNameSig = input.required<string>();
  floorSig!: Signal<Floor>;
  buildingNameSig = input.required<string>();
  buildingSig!: Signal<Building>;

  subjectList = [
    'aaaa',
    'bbb',
    'cccccc',
    'dddddddd',
    'eeeeeee',
    'fffff',
    'gggg',
    'hhhhhhhh',
    'iiiiiii',
    'jjjjjjj',
    'kkkkkkk',
    'llllllll',
  ];

  ngOnInit(): void {
    this._adminRoomService.init();
    this._adminFloorService.init();
    this._adminBuildingService.init();
    this.roomSig = this._adminRoomService.getRoomByName(this.roomNameSig());
    this.floorSig = this._adminFloorService.getFloorByName(this.floorNameSig());
    this.buildingSig = this._adminBuildingService.getBuildingByName(this.buildingNameSig());
  }

  onSubjectListChange(changedSubjectList: string[]): void {
    const updatedRoom: Room = {
      ...this.roomSig(),
      subjectList: changedSubjectList as SubjectName[],
    };
    this._adminRoomService.updateRoom(this.roomSig(), updatedRoom);
    this._updateFloorAndBuilding(updatedRoom);
  }

  onTimetableItemChange(changedTimetableItem: TimeTableItem): void {
    const updatedRoomTimetable = this.roomSig().timetable.map((timeTableItem: TimeTableItem) =>
      timeTableItem.weekDay === changedTimetableItem.weekDay ? changedTimetableItem : timeTableItem,
    );

    const updatedRoom: Room = { ...this.roomSig(), timetable: updatedRoomTimetable };
    this._adminRoomService.updateRoom(this.roomSig(), updatedRoom);
    this._updateFloorAndBuilding(updatedRoom);
  }

  private _updateFloorAndBuilding(updatedRoom: Room): void {
    const updatedFloor: Floor = {
      ...this.floorSig(),
      roomList: this.floorSig().roomList.map((room: Room) => (room.name === updatedRoom.name ? updatedRoom : room)),
    };
    this._adminFloorService.updateFloor(this.floorSig(), updatedFloor);
    this._updateBuilding(updatedFloor);
  }

  private _updateBuilding(changedFloor: Floor): void {
    const updatedBuilding: Building = {
      ...this.buildingSig(),
      floorList: this.buildingSig().floorList.map((floor: Floor) => (floor.name === changedFloor.name ? changedFloor : floor)),
    };
    this._adminBuildingService.updateBuilding(this.buildingSig(), updatedBuilding);
  }
}
