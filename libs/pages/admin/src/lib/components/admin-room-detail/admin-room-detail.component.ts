import { ChangeDetectionStrategy, Component, inject, input, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicChipListComponent, TimetableItemComponent } from '@free-spot/ui';
import { AdminRoomTimetableItemComponent } from '../admin-room-timetable-item/admin-room-timetable-item.component';
import { SubjectName } from '@free-spot/enums';
import { Room, TimeTableItem } from '@free-spot/models';
import { AdminRoomService } from '@free-spot-service/room';

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

  roomNameSig = input.required<string>();
  roomSig!: Signal<Room>;

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
    this.roomSig = this._adminRoomService.getRoomByName(this.roomNameSig());
  }

  onSubjectListChange(changedSubjectList: string[]): void {
    const updatedRoom: Room = {
      ...this.roomSig(),
      subjectList: changedSubjectList as SubjectName[],
    };
    this._adminRoomService.updateRoom(this.roomSig(), updatedRoom);
  }

  onAddSubject(addedSubject: string): void {
    const updatedRoom: Room = {
      ...this.roomSig(),
      subjectList: this.roomSig().subjectList
        ? [...this.roomSig().subjectList, addedSubject as SubjectName]
        : [addedSubject as SubjectName],
    };
    this._adminRoomService.updateRoom(this.roomSig(), updatedRoom);
  }

  onRemoveSubject(removedSubject: string): void {
    const updatedRoom: Room = {
      ...this.roomSig(),
      subjectList: this.roomSig().subjectList.filter((subject: SubjectName) => subject !== (removedSubject as SubjectName)),
    };
    this._adminRoomService.updateRoom(this.roomSig(), updatedRoom);
  }

  onTimetableItemChange(changedTimetableItem: TimeTableItem): void {
    const updatedRoomTimetable = this.roomSig().timetable.map((timeTableItem: TimeTableItem) =>
      timeTableItem.weekDay === changedTimetableItem.weekDay ? changedTimetableItem : timeTableItem,
    );

    const updatedRoom: Room = { ...this.roomSig(), timetable: updatedRoomTimetable };
    this._adminRoomService.updateRoom(this.roomSig(), updatedRoom);
  }
}

// getTimetableActivity(weekDay: WeekDay): TimeTableItem {
//   return {
//     weekDay: weekDay,
//     activities: [this.timetableActivityItem1],
//   };
// }

// timetableActivityItem1: TimetableActivityItem = {
//   startHour: 8,
//   endHour: 10,
//   subjectName: SubjectName.TLELEFONY,
//   roomName: '5432',
//   activiteType: Event.LABORATORY,
//   weekParity: WeekParity.ODD,
// };

// timeTable = [
//   this.getTimetableActivity(WeekDay.MONDAY),
//   this.getTimetableActivity(WeekDay.TUESDAY),
//   this.getTimetableActivity(WeekDay.WEDNESDAY),
//   this.getTimetableActivity(WeekDay.THURSDAY),
//   this.getTimetableActivity(WeekDay.FRIDAY),
// ];

// newRoom: Room = {
//   name: '',
//   subjectList: ['aaaa' as SubjectName, 'bbb' as SubjectName, 'cccccc' as SubjectName],
//   timetable: [],
//   totalSpotsNumber: 20,
//   freeSpots: 10,
//   busySpots: 0,
//   unavailableSpots: 1,
// };

// timetableActivityMonday1: TimetableActivityItem = {
//   startHour: 8,
//   endHour: 10,
//   subjectName: SubjectName.TLELEFONY,
//   roomName: '5432',
//   activiteType: Event.LABORATORY,
//   weekParity: WeekParity.ODD,
// };
// timetableActivityMonday2: TimetableActivityItem = {
//   startHour: 14,
//   endHour: 16,
//   subjectName: SubjectName.TLELEFONY,
//   roomName: '5432',
//   activiteType: Event.LABORATORY,
//   weekParity: WeekParity.ODD,
// };

// roomTimetable: TimeTableItem[] = [
//   { weekDay: WeekDay.MONDAY, activities: [this.timetableActivityMonday1, this.timetableActivityMonday2] },
//   { weekDay: WeekDay.TUESDAY, activities: [] },
//   { weekDay: WeekDay.WEDNESDAY, activities: [this.timetableActivityMonday1, this.timetableActivityMonday2] },
//   { weekDay: WeekDay.THURSDAY, activities: [] },
//   { weekDay: WeekDay.FRIDAY, activities: [this.timetableActivityMonday1, this.timetableActivityMonday2] },
// ];
