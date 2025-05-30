import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal } from '@angular/core';

import { TimetableItemComponent } from '@free-spot/ui';
import { FreeSpotUser, Group, SemiGroup, TimeTableItem } from '@free-spot/models';
import { WeekDay } from '@free-spot/enums';
import { UserService } from '@free-spot-service/user';
import { AdminFacultyService } from '@free-spot-service/faculty';

@Component({
  selector: 'free-spot-schedule',

  imports: [TimetableItemComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit {
  private _userService: UserService = inject(UserService);
  private _adminFacultyService: AdminFacultyService = inject(AdminFacultyService);

  private _currentUserEmail = (
    JSON.parse(localStorage.getItem('user') as string) as {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    }
  ).email;

  currentUserSig: Signal<FreeSpotUser> = this._userService.getFreeSpotUserByEmail(this._currentUserEmail);
  userTimetableItemsSig: Signal<TimeTableItem[]> = computed(() => this._getUserTimetableItemList());

  emptyTimetable: TimeTableItem[] = [
    { weekDay: WeekDay.MONDAY, activities: [], date: new Date() },
    { weekDay: WeekDay.TUESDAY, activities: [], date: new Date() },
    { weekDay: WeekDay.WEDNESDAY, activities: [], date: new Date() },
    { weekDay: WeekDay.THURSDAY, activities: [], date: new Date() },
    { weekDay: WeekDay.FRIDAY, activities: [], date: new Date() },
  ];

  ngOnInit(): void {
    this._userService.init();
    this._adminFacultyService.init();
  }

  private _getUserTimetableItemList(): TimeTableItem[] {
    let userTimetableItemList: TimeTableItem[] = [];
    if (Object.keys(this.currentUserSig()).length) {
      const userGroup: Group = this._adminFacultyService.getGroupByName(this.currentUserSig().group as string)();
      const userSemiGroup: SemiGroup = this._getUserSemigroup(this.currentUserSig().semiGroup as string, userGroup);

      if (Object.keys(userGroup).length) {
        if (Object.keys(userSemiGroup).length) {
          userTimetableItemList = userSemiGroup.timetable;
        } else {
          userTimetableItemList = userGroup.timetable;
        }
      }
    }
    return userTimetableItemList;
  }

  private _getUserSemigroup(semiGroupName: string, userGroup: Group): SemiGroup {
    return userGroup.semigroups?.find((semiGroup: SemiGroup) => semiGroup.name === semiGroupName) || ({} as SemiGroup);
  }
}
