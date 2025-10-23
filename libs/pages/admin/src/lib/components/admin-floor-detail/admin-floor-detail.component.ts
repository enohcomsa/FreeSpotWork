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

import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BuildingLegacy, FloorLegacy, Room, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { AdminRoomCardComponent } from '../admin-room-card/admin-room-card.component';
import { AdminRoomService } from '@free-spot-service/room';
import { WeekDay } from '@free-spot/enums';
import { AddItemCardComponent } from '@free-spot/ui';
import { AdminFloorService } from '@free-spot-service/floor';
import { BuildingService } from '@free-spot-service/building';
import { AdminFacultyService } from '@free-spot-service/faculty';
import { AppDateService } from '@free-spot-service/app-date';
import { UserService } from '@free-spot-service/user';
import { ConfirmModalService } from '@free-spot-service/confirm-modal';
import { FormErrorMessage } from '@free-spot/util';

@Component({
  selector: 'free-spot-admin-floor-detail',

  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AdminRoomCardComponent,
    AddItemCardComponent
],
  templateUrl: './admin-floor-detail.component.html',
  styleUrl: './admin-floor-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFloorDetailComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _adminRoomService: AdminRoomService = inject(AdminRoomService);
  private _adminFloorService: AdminFloorService = inject(AdminFloorService);
  private _adminBuildingService: BuildingService = inject(BuildingService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);
  private _appDateService: AppDateService = inject(AppDateService);
  private _userService: UserService = inject(UserService);
  private _confirmService: ConfirmModalService = inject(ConfirmModalService);
  private _formErrorMessage: FormErrorMessage = inject(FormErrorMessage);

  editRoom = viewChild.required<ElementRef>('editRoom');
  floorNameSig = input.required<string>();
  floorSig!: Signal<FloorLegacy>;
  buildingNameSig = input.required<string>();
  buildingSig!: Signal<BuildingLegacy>;

  oldRoomSig: WritableSignal<Room> = signal({} as Room);

  addingRoom = false;
  editingRoom = false;
  addRoomFormGroup = this._formBuilder.nonNullable.group({
    roomName: ['', [Validators.required, Validators.minLength(1)]],
    totalSpotsNumber: [0, Validators.required],
    unavailableSpots: [0, Validators.required],
  });
  roomEmptyTimetable: Signal<TimeTableItem[]> = computed(() => [
    { weekDay: WeekDay.MONDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.MONDAY) },
    { weekDay: WeekDay.TUESDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.TUESDAY) },
    { weekDay: WeekDay.WEDNESDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.WEDNESDAY) },
    { weekDay: WeekDay.THURSDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.THURSDAY) },
    { weekDay: WeekDay.FRIDAY, activities: [], date: this._appDateService.getAppDateByWeekDay(WeekDay.FRIDAY) },
  ]);

  ngOnInit(): void {
    this._adminRoomService.init();
    this._adminFloorService.init();
    this._adminBuildingService.init();
    this._adminFacultyService.init();
    this._appDateService.init();
    this._userService.init();
    this.floorSig = this._adminFloorService.getFloorByName(this.floorNameSig());
    this.buildingSig = this._adminBuildingService.getBuildingByName(this.buildingNameSig());
  }

  displayError = (control: AbstractControl | null) => this._formErrorMessage.displayFormErrorMessage(control);

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
    const updatedFloor: FloorLegacy = this._createNewRoomFloor(newRoom);

    this._adminRoomService.addRoom(newRoom);
    this._adminFloorService.updateFloor(this.floorSig(), updatedFloor);
    this._updateBuilding(updatedFloor);
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
    const freeSpotsModifier =
      (this.addRoomFormGroup.controls['totalSpotsNumber'].value as number) -
      this.oldRoomSig().totalSpotsNumber -
      ((this.addRoomFormGroup.controls['unavailableSpots'].value as number) - this.oldRoomSig().unavailableSpots);
    const newRoom: Room = {
      ...this._createRoom(
        this.addRoomFormGroup.controls['roomName'].value as string,
        this.addRoomFormGroup.controls['totalSpotsNumber'].value as number,
        this.addRoomFormGroup.controls['unavailableSpots'].value as number,
      ),
      subjectList: this.oldRoomSig().subjectList,
      timetable: this.oldRoomSig().timetable.map((timeTableItem: TimeTableItem) => {
        return {
          ...timeTableItem,
          activities: timeTableItem.activities?.map((timetebleActivity: TimetableActivityItem) => {
            return {
              ...timetebleActivity,
              freeSpots: timetebleActivity.freeSpots + freeSpotsModifier,
            };
          }),
        };
      }),
    };

    const diffRoom: Room = {
      ...this.oldRoomSig(),
      totalSpotsNumber: newRoom.totalSpotsNumber - (this.oldRoomSig().totalSpotsNumber as number),
      unavailableSpots: newRoom.unavailableSpots - (this.oldRoomSig().unavailableSpots as number),
    };
    const updatedFloor: FloorLegacy = this._createEditRoomFloor(diffRoom, newRoom);

    this._adminRoomService.updateRoom(this.oldRoomSig() as Room, newRoom);
    this._adminFloorService.updateFloor(this.floorSig(), updatedFloor);
    this._updateBuilding(updatedFloor);
    this.addRoomFormGroup.reset();
    this.addingRoom = false;
    this.editingRoom = false;
  }

  onDeleteRoom(deletedRoom: Room): void {
    this._confirmService
      .openConfirmDialog('Are you sure you want to delete this room?')
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          const diffRoom: Room = {
            ...this.oldRoomSig(),
            totalSpotsNumber: -deletedRoom.totalSpotsNumber,
            unavailableSpots: -deletedRoom.unavailableSpots,
          };
          const updatedFloor: FloorLegacy = this._createDeleteRoomFloor(diffRoom, deletedRoom);

          this._userService.removeTimetableActivitiesByRoomName(deletedRoom.name);
          this._adminFacultyService.removeTimetableActivitiesByRoomName(deletedRoom.name);
          this._adminRoomService.deleteRoom(deletedRoom);
          this._adminFloorService.updateFloor(this.floorSig(), updatedFloor);
          this._updateBuilding(updatedFloor);
          this.addRoomFormGroup.reset();
          this.addingRoom = false;
          this.editingRoom = false;
        }
      });
  }

  private _createRoom(roomName: string, totalSpotsNumber: number, unavailableSpots: number): Room {
    return {
      name: roomName,
      floorName: this.floorNameSig(),
      subjectList: [],
      timetable: this.roomEmptyTimetable(),
      totalSpotsNumber: totalSpotsNumber,
      unavailableSpots: unavailableSpots,
    };
  }

  private _createNewRoomFloor(addedRoom: Room): FloorLegacy {
    return {
      ...this.floorSig(),
      roomList: this.floorSig().roomList ? [...this.floorSig().roomList, addedRoom] : [addedRoom],
      totalSpotsNumber: this._reduceSpotNumber('totalSpotsNumber', addedRoom),
      unavailableSpots: this._reduceSpotNumber('unavailableSpots', addedRoom),
    };
  }

  private _createEditRoomFloor(diffRoom: Room, newRoom: Room): FloorLegacy {
    return {
      ...this.floorSig(),
      roomList: this.floorSig().roomList.map((room: Room) => (room === this.oldRoomSig() ? newRoom : room)),
      totalSpotsNumber: this._reduceSpotNumber('totalSpotsNumber', diffRoom),
      unavailableSpots: this._reduceSpotNumber('unavailableSpots', diffRoom),
    };
  }
  private _createDeleteRoomFloor(diffRoom: Room, deletedRoom: Room): FloorLegacy {
    return {
      ...this.floorSig(),
      roomList: this.floorSig().roomList.filter((room: Room) => room.name !== deletedRoom.name),
      totalSpotsNumber: this._reduceSpotNumber('totalSpotsNumber', diffRoom),
      unavailableSpots: this._reduceSpotNumber('unavailableSpots', diffRoom),
    };
  }

  private _reduceSpotNumber(
    spotType: keyof Omit<Room, 'subjectList' | 'name' | 'timetable' | 'floorName'>,
    newRoom?: Room,
  ): number {
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

  private _updateBuilding(changedFloor: FloorLegacy): void {
    const updatedBuilding: BuildingLegacy = {
      ...this.buildingSig(),
      floorList: this.buildingSig().floorList.map((floor: FloorLegacy) => (floor.name === changedFloor.name ? changedFloor : floor)),
    };
    this._adminBuildingService.updateBuilding(this.buildingSig(), updatedBuilding);
  }
}
