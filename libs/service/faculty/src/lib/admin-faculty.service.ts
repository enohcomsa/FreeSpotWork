import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Faculty, Group, SemiGroup, TimetableActivityItem, TimeTableItem, Year } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpFacultyService } from '@http-free-spot/faculty';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminFacultyService {
  private _httpFacultyService: HttpFacultyService = inject(HttpFacultyService);

  private _facultyListSig: WritableSignal<Faculty[]> = signal([]);
  facultyListSig = this._facultyListSig.asReadonly();

  init(): void {
    this._httpFacultyService
      .getFacultyList()
      .pipe(take(1))
      .subscribe((facultyList: Faculty[]) => {
        this._facultyListSig.set(facultyList?.filter((faculty: Faculty) => faculty !== null));
      });
  }

  getFacultyByName(facultyName: string): Signal<Faculty> {
    return computed(() => this.facultyListSig().find((faculty: Faculty) => faculty.name === facultyName) || ({} as Faculty));
  }

  getFacultyByGroupName(groupName: string): Signal<Faculty> {
    return computed(
      () =>
        this.facultyListSig().find((faculty: Faculty) => {
          return faculty.yearList
            ?.map((year: Year) => year.yearGroupList?.some((group: Group) => group.name === groupName))
            .some((checkedYear: boolean) => checkedYear === true);
        }) || ({} as Faculty),
    );
  }

  getGroupByName(groupName: string): Signal<Group> {
    return computed(() => {
      let foundGroup: Group = {} as Group;
      this.facultyListSig()?.forEach((faculty: Faculty) =>
        faculty.yearList?.forEach((year: Year) =>
          year.yearGroupList.forEach((group: Group) => {
            if (group.name === groupName) {
              foundGroup = group;
            }
          }),
        ),
      );

      return foundGroup;
    });
  }

  removeDeletedTimetableActivity(removedTimetableActivity: TimetableActivityItem): void {
    const newFacultyList: Faculty[] = this._facultyListSig().map((faculty: Faculty) => {
      return {
        ...faculty,
        yearList:
          faculty.yearList?.map((year: Year) => {
            return {
              ...year,
              yearGroupList:
                year.yearGroupList?.map((group: Group) =>
                  this._removeTimetableActivityFromGroup(group, removedTimetableActivity),
                ) || [],
            };
          }) || [],
      };
    });
    this._facultyListSig.set(newFacultyList);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  removeTimetableActivitiesByRoomName(deletedRoomName: string): void {
    const newFacultyList: Faculty[] = this._facultyListSig().map((faculty: Faculty) => {
      return {
        ...faculty,
        yearList:
          faculty.yearList?.map((year: Year) => {
            return {
              ...year,
              yearGroupList:
                year.yearGroupList?.map((group: Group) => this._removeRoomTimetableActivity(group, deletedRoomName)) || [],
            };
          }) || [],
      };
    });
    this._facultyListSig.set(newFacultyList);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  addFaculty(newFaculty: Faculty): void {
    SignalArrayUtil.addItem(newFaculty, this._facultyListSig);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  updateFaculty(oldFaculty: Faculty, updatedFaculty: Faculty): void {
    SignalArrayUtil.replaceItem(oldFaculty, this._facultyListSig, updatedFaculty);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  deleteFaculty(deletedFaculty: Faculty): void {
    SignalArrayUtil.deleteItem(deletedFaculty, this._facultyListSig);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  private _removeTimetableActivityFromGroup(group: Group, removedTimetableActivity: TimetableActivityItem): Group {
    if (group.semigroups !== null && group.semigroups !== undefined) {
      group = {
        ...group,
        semigroups: group.semigroups.map((semigroup: SemiGroup) => {
          return {
            ...semigroup,
            timetable: semigroup.timetable.map((timeTableItem: TimeTableItem) => {
              return {
                ...timeTableItem,
                activities: timeTableItem.activities?.filter((timetableActivity: TimetableActivityItem) => {
                  return !(
                    timetableActivity.roomName === removedTimetableActivity.roomName &&
                    timetableActivity.subjectItem.name === removedTimetableActivity.subjectItem.name &&
                    timetableActivity.startHour === removedTimetableActivity.startHour &&
                    timetableActivity.weekParity === removedTimetableActivity.weekParity
                  );
                }),
              };
            }),
          };
        }),
      };
    } else {
      group = {
        ...group,
        timetable: group.timetable.map((timeTableItem: TimeTableItem) => {
          return {
            ...timeTableItem,
            activities: timeTableItem.activities?.filter((timetableActivity: TimetableActivityItem) => {
              return !(
                timetableActivity.roomName === removedTimetableActivity.roomName &&
                timetableActivity.subjectItem.name === removedTimetableActivity.subjectItem.name &&
                timetableActivity.startHour === removedTimetableActivity.startHour &&
                timetableActivity.weekParity === removedTimetableActivity.weekParity
              );
            }),
          };
        }),
      };
    }

    return group;
  }

  private _removeRoomTimetableActivity(group: Group, deletedRoomName: string): Group {
    if (group.semigroups !== null && group.semigroups !== undefined) {
      group = {
        ...group,
        semigroups: group.semigroups.map((semigroup: SemiGroup) => {
          return {
            ...semigroup,
            timetable: semigroup.timetable.map((timeTableItem: TimeTableItem) => {
              return {
                ...timeTableItem,
                activities: timeTableItem.activities?.filter(
                  (timetableActivity: TimetableActivityItem) => timetableActivity.roomName !== deletedRoomName,
                ),
              };
            }),
          };
        }),
      };
    } else {
      group = {
        ...group,
        timetable: group.timetable.map((timeTableItem: TimeTableItem) => {
          return {
            ...timeTableItem,
            activities: timeTableItem.activities?.filter(
              (timetableActivity: TimetableActivityItem) => timetableActivity.roomName !== deletedRoomName,
            ),
          };
        }),
      };
    }

    return group;
  }
}
