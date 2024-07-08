import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableItemComponent } from '@free-spot/ui';
import { Group, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { SubjectName, WeekParity, Event, WeekDay } from '@free-spot/enums';

@Component({
  selector: 'free-spot-schedule',
  standalone: true,
  imports: [CommonModule, TimetableItemComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  timetableActivityItem1: TimetableActivityItem = {
    startHour: 8,
    endHour: 10,
    subjectName: SubjectName.TLELEFONY,
    roomName: '5432',
    activiteType: Event.LABORATORY,
    weekParity: WeekParity.ODD,
  };
  timetableActivityItem2: TimetableActivityItem = {
    startHour: 12,
    endHour: 14,
    subjectName: SubjectName.TLELEFONY,
    roomName: '5432',
    activiteType: Event.COURSE,
    weekParity: WeekParity.BOTH,
  };
  timetableActivityItem3: TimetableActivityItem = {
    startHour: 16,
    endHour: 18,
    subjectName: SubjectName.TLELEFONY,
    roomName: '5432',
    activiteType: Event.PROJECT,
    weekParity: WeekParity.EVEN,
  };
  timetableActivityItem4: TimetableActivityItem = {
    startHour: 8,
    endHour: 10,
    subjectName: SubjectName.CID,
    roomName: '542',
    activiteType: Event.PROJECT,
    weekParity: WeekParity.EVEN,
  };

  groupData: Group = {
    name: 'gr1',
    studentList: [
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
    ],
    timeTable: [
      this.getTimetableActivity(WeekDay.MONDAY),
      this.getTimetableActivity(WeekDay.TUESDAY),
      this.getTimetableActivity(WeekDay.WEDNESDAY),
      this.getTimetableActivity(WeekDay.THURSDAY),
      this.getTimetableActivity(WeekDay.FRIDAY),
    ],
  };

  getTimetableActivity(weekDay: WeekDay): TimeTableItem {
    return {
      weekDay: weekDay,
      activities: [
        this.timetableActivityItem1,
        this.timetableActivityItem2,
        this.timetableActivityItem3,
        this.timetableActivityItem4,
      ],
    };
  }
}
