import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Signal } from '@angular/core';

import { DynamicChipListComponent, TimetableItemComponent } from '@free-spot/ui';
import { AdminRoomTimetableItemComponent } from '../admin-room-timetable-item/admin-room-timetable-item.component';
import { BuildingLegacy, FloorLegacy, RoomLegacy, SubjectItemLegacy, TimeTableItem } from '@free-spot/models';
import { AdminRoomService } from '@free-spot-service/room';
import { BuildingService } from '@free-spot-service/building';
import { AdminFloorService } from '@free-spot-service/floor';
import { SubjectService } from '@free-spot-service/subject';
import { SUBJECT_LIST } from '@free-spot/constants';
import { UpdateRoomCmd } from '@free-spot-domain/room';
import { SubjectItem } from '@free-spot-domain/subject';

@Component({
  selector: 'free-spot-admin-room-detail',
  imports: [DynamicChipListComponent, AdminRoomTimetableItemComponent, TimetableItemComponent],
  templateUrl: './admin-room-detail.component.html',
  styleUrl: './admin-room-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomDetailComponent implements OnInit {
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  private _adminBuildingService: BuildingService = inject(BuildingService);
  private _adminSubjectService: SubjectService = inject(SubjectService);

  roomIdSig = input.required<string>();
  readonly roomSig = computed(() => this._adminRoomService.getSignalById(this.roomIdSig())());
  readonly roomSubjectListSig = computed(() =>
    this.subjectListSig().filter((subjectItem: SubjectItem) =>
      this.roomSig().subjectList.some((subjectItemId) => subjectItemId === subjectItem.id)));


  // roomSig!: Signal<RoomLegacy>;
  // floorNameSig = input.required<string>();
  // floorSig!: Signal<FloorLegacy>;
  // buildingNameSig = input.required<string>();
  // buildingSig!: Signal<BuildingLegacy>;

  subjectListLegacy: SubjectItemLegacy[] = SUBJECT_LIST;
  subjectListSig: Signal<SubjectItem[]> = this._adminSubjectService.subjectListSig;

  ngOnInit(): void {
    this._adminRoomService.init();
    this._adminFloorService.init();
    this._adminBuildingService.init();
    this._adminSubjectService.init();
  }

  onSubjectListChange(subjectItemList: SubjectItem[]): void {

    const updatedRoom: UpdateRoomCmd = {
      subjectList: subjectItemList.map((subjectItem: SubjectItem) => subjectItem.id),
    }
    this._adminRoomService.update(this.roomIdSig(), updatedRoom);

  }

  // onTimetableItemChange(changedTimetableItem: TimeTableItem): void {
  //   const updatedRoomTimetable = this.roomSig().timetable.map((timeTableItem: TimeTableItem) =>
  //     timeTableItem.weekDay === changedTimetableItem.weekDay ? changedTimetableItem : timeTableItem,
  //   );

  //   const updatedRoom: RoomLegacy = { ...this.roomSig(), timetable: updatedRoomTimetable };
  //   this._adminRoomService.updateRoom(this.roomSig(), updatedRoom);
  //   this._updateFloorAndBuilding(updatedRoom);
  // }

}
