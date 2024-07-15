import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableItemComponent } from '@free-spot/ui';
import { Group, SubjectItem, TimetableActivityItem, TimeTableItem } from '@free-spot/models';
import { WeekParity, Event, WeekDay } from '@free-spot/enums';
import { SUBJECT_LIST } from '@free-spot/constants';

@Component({
  selector: 'free-spot-schedule',
  standalone: true,
  imports: [CommonModule, TimetableItemComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  subjectList: SubjectItem[] = SUBJECT_LIST;
  timetableActivityItem1: TimetableActivityItem = {
    startHour: 8,
    endHour: 10,
    subjectItem: this.subjectList[0],
    roomName: '5432',
    activiteType: Event.LABORATORY,
    weekParity: WeekParity.ODD,
    freeSpots: 0,
    busySpots: 0,
  };
  timetableActivityItem2: TimetableActivityItem = {
    startHour: 12,
    endHour: 14,
    subjectItem: this.subjectList[1],
    roomName: '5432',
    activiteType: Event.COURSE,
    weekParity: WeekParity.BOTH,
    freeSpots: 0,
    busySpots: 0,
  };
  timetableActivityItem3: TimetableActivityItem = {
    startHour: 16,
    endHour: 18,
    subjectItem: this.subjectList[0],
    roomName: '5432',
    activiteType: Event.PROJECT,
    weekParity: WeekParity.EVEN,
    freeSpots: 0,
    busySpots: 0,
  };
  timetableActivityItem4: TimetableActivityItem = {
    startHour: 8,
    endHour: 10,
    subjectItem: this.subjectList[2],
    roomName: '542',
    activiteType: Event.PROJECT,
    weekParity: WeekParity.EVEN,
    freeSpots: 0,
    busySpots: 0,
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
