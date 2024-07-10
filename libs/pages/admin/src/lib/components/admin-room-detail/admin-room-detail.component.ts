import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicChipListComponent, TimetableItemComponent } from '@free-spot/ui';
import { AdminRoomTimetableItemComponent } from '../admin-room-timetable-item/admin-room-timetable-item.component';
import { SubjectName, WeekParity, Event, WeekDay } from '@free-spot/enums';
import { TimetableActivityItem, TimeTableItem } from '@free-spot/models';

@Component({
  selector: 'free-spot-admin-room-detail',
  standalone: true,
  imports: [CommonModule, DynamicChipListComponent, AdminRoomTimetableItemComponent, TimetableItemComponent],
  templateUrl: './admin-room-detail.component.html',
  styleUrl: './admin-room-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomDetailComponent {
  roomNameSig = input.required<string>();
  timetableActivityMonday1: TimetableActivityItem = {
    startHour: 8,
    endHour: 10,
    subjectName: SubjectName.TLELEFONY,
    roomName: '5432',
    activiteType: Event.LABORATORY,
    weekParity: WeekParity.ODD,
  };
  timetableActivityMonday2: TimetableActivityItem = {
    startHour: 14,
    endHour: 16,
    subjectName: SubjectName.TLELEFONY,
    roomName: '5432',
    activiteType: Event.LABORATORY,
    weekParity: WeekParity.ODD,
  };

  roomTimetable: TimeTableItem[] = [
    { weekDay: WeekDay.MONDAY, activities: [this.timetableActivityMonday1, this.timetableActivityMonday2] },
    { weekDay: WeekDay.TUESDAY, activities: [] },
    { weekDay: WeekDay.WEDNESDAY, activities: [this.timetableActivityMonday1, this.timetableActivityMonday2] },
    { weekDay: WeekDay.THURSDAY, activities: [] },
    { weekDay: WeekDay.FRIDAY, activities: [this.timetableActivityMonday1, this.timetableActivityMonday2] },
  ];

  subjectList = [
    'enoh',
    'dsada',
    'dsggggg',
    'bbbbbbbb',
    'ffffffff',
    'zzzzzzz',
    'enoh',
    'dsada',
    'dsggggg',
    'bbbbbbbb',
    'ffffffff',
    'zzzzzzz',
    'enoh',
    'dsada',
    'dsggggg',
    'bbbbbbbb',
    'ffffffff',
    'zzzzzzz',
  ];

  timetableActivityItem1: TimetableActivityItem = {
    startHour: 8,
    endHour: 10,
    subjectName: SubjectName.TLELEFONY,
    roomName: '5432',
    activiteType: Event.LABORATORY,
    weekParity: WeekParity.ODD,
  };

  timeTable = [
    this.getTimetableActivity(WeekDay.MONDAY),
    this.getTimetableActivity(WeekDay.TUESDAY),
    this.getTimetableActivity(WeekDay.WEDNESDAY),
    this.getTimetableActivity(WeekDay.THURSDAY),
    this.getTimetableActivity(WeekDay.FRIDAY),
  ];

  getTimetableActivity(weekDay: WeekDay): TimeTableItem {
    return {
      weekDay: weekDay,
      activities: [this.timetableActivityItem1],
    };
  }
}
