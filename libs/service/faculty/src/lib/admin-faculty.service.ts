import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { FacultyLegacy, Group, SemiGroup, TimetableActivityItemLegacy, TimeTableItemLecagy, Year } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpFacultyService } from '@http-free-spot/faculty';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminFacultyService {
  private _httpFacultyService: HttpFacultyService = inject(HttpFacultyService);
  private _facultyListSig: WritableSignal<FacultyLegacy[]> = signal([]);
  facultyListSig = this._facultyListSig.asReadonly();

  init(): void {
    if (!this._facultyListSig().length) {
      this._httpFacultyService
        .getFacultyList()
        .pipe(take(1))
        .subscribe((facultyList: FacultyLegacy[]) => {
          this._facultyListSig.set(facultyList?.filter((faculty: FacultyLegacy) => faculty !== null));
        });
    }
  }

  getFacultyByName(facultyName: string): Signal<FacultyLegacy> {
    return computed(() => this._facultyListSig().find((faculty: FacultyLegacy) => faculty.name === facultyName) || ({} as FacultyLegacy));
  }

  getFacultyByGroupName(groupName: string): Signal<FacultyLegacy> {
    return computed(
      () =>
        this.facultyListSig().find((faculty: FacultyLegacy) => {
          return faculty.yearList
            ?.map((year: Year) => year.yearGroupList?.some((group: Group) => group.name === groupName))
            .some((checkedYear: boolean) => checkedYear === true);
        }) || ({} as FacultyLegacy),
    );
  }

  getGroupByName(groupName: string): Signal<Group> {
    return computed(() => {
      let foundGroup: Group = {} as Group;
      this.facultyListSig()?.forEach((faculty: FacultyLegacy) =>
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

  removeDeletedTimetableActivity(removedTimetableActivity: TimetableActivityItemLegacy): void {
    const newFacultyList: FacultyLegacy[] = this._facultyListSig().map((faculty: FacultyLegacy) => {
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
    const newFacultyList: FacultyLegacy[] = this._facultyListSig().map((faculty: FacultyLegacy) => {
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

  updateTimetableActivitySpots(changedTimetableActivity: TimetableActivityItemLegacy, addingBooking: boolean): void {
    const newFacultyList: FacultyLegacy[] = this._facultyListSig().map((faculty: FacultyLegacy) => {
      return {
        ...faculty,
        yearList:
          faculty.yearList?.map((year: Year) => {
            return {
              ...year,
              yearGroupList:
                year.yearGroupList?.map((group: Group) =>
                  this._updateTimetableActivityFromGroup(group, changedTimetableActivity, addingBooking),
                ) || [],
            };
          }) || [],
      };
    });

    this._facultyListSig.set(newFacultyList);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  addFaculty(newFaculty: FacultyLegacy): void {
    SignalArrayUtil.addItem(newFaculty, this._facultyListSig);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  updateFaculty(oldFaculty: FacultyLegacy, updatedFaculty: FacultyLegacy): void {
    SignalArrayUtil.replaceItem(oldFaculty, this._facultyListSig, updatedFaculty);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  deleteFaculty(deletedFaculty: FacultyLegacy): void {
    SignalArrayUtil.deleteItem(deletedFaculty, this._facultyListSig);
    this._httpFacultyService.storeFacultyList(this._facultyListSig());
  }

  private _removeTimetableActivityFromGroup(group: Group, removedTimetableActivity: TimetableActivityItemLegacy): Group {
    if (group.semigroups !== null && group.semigroups !== undefined) {
      group = {
        ...group,
        semigroups: group.semigroups.map((semigroup: SemiGroup) => {
          return {
            ...semigroup,
            timetable: semigroup.timetable.map((timeTableItem: TimeTableItemLecagy) => {
              return {
                ...timeTableItem,
                activities: timeTableItem.activities?.filter((timetableActivity: TimetableActivityItemLegacy) => {
                  return !this._checkTimetebleActivityEquality(timetableActivity, removedTimetableActivity);
                }),
              };
            }),
          };
        }),
      };
    } else {
      group = {
        ...group,
        timetable: group.timetable.map((timeTableItem: TimeTableItemLecagy) => {
          return {
            ...timeTableItem,
            activities: timeTableItem.activities?.filter((timetableActivity: TimetableActivityItemLegacy) => {
              return !this._checkTimetebleActivityEquality(timetableActivity, removedTimetableActivity);
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
            timetable: semigroup.timetable.map((timeTableItem: TimeTableItemLecagy) => {
              return {
                ...timeTableItem,
                activities: timeTableItem.activities?.filter(
                  (timetableActivity: TimetableActivityItemLegacy) => timetableActivity.roomName !== deletedRoomName,
                ),
              };
            }),
          };
        }),
      };
    } else {
      group = {
        ...group,
        timetable: group.timetable.map((timeTableItem: TimeTableItemLecagy) => {
          return {
            ...timeTableItem,
            activities: timeTableItem.activities?.filter(
              (timetableActivity: TimetableActivityItemLegacy) => timetableActivity.roomName !== deletedRoomName,
            ),
          };
        }),
      };
    }

    return group;
  }

  private _updateTimetableActivityFromGroup(
    group: Group,
    changedTimetableActivity: TimetableActivityItemLegacy,
    addingBooking: boolean,
  ): Group {
    if (group.semigroups !== null && group.semigroups !== undefined) {
      group = {
        ...group,
        semigroups: group.semigroups.map((semigroup: SemiGroup) => {
          return {
            ...semigroup,
            timetable: semigroup.timetable.map((timeTableItem: TimeTableItemLecagy) => {
              return {
                ...timeTableItem,
                activities: timeTableItem.activities?.map((timetableActivity: TimetableActivityItemLegacy) => {
                  return this._checkTimetebleActivityEquality(changedTimetableActivity, timetableActivity)
                    ? {
                        ...timetableActivity,
                        freeSpots: addingBooking ? timetableActivity.freeSpots - 1 : timetableActivity.freeSpots + 1,
                        busySpots: addingBooking ? timetableActivity.busySpots + 1 : timetableActivity.busySpots - 1,
                      }
                    : timetableActivity;
                }),
              };
            }),
          };
        }),
      };
    } else {
      group = {
        ...group,
        timetable: group.timetable.map((timeTableItem: TimeTableItemLecagy) => {
          return {
            ...timeTableItem,
            activities: timeTableItem.activities?.map((timetableActivity: TimetableActivityItemLegacy) => {
              return this._checkTimetebleActivityEquality(changedTimetableActivity, timetableActivity)
                ? {
                    ...timetableActivity,
                    freeSpots: addingBooking ? timetableActivity.freeSpots - 1 : timetableActivity.freeSpots + 1,
                    busySpots: addingBooking ? timetableActivity.busySpots + 1 : timetableActivity.busySpots - 1,
                  }
                : timetableActivity;
            }),
          };
        }),
      };
    }
    return group;
  }

  private _checkTimetebleActivityEquality(
    timetableActivity1: TimetableActivityItemLegacy,
    timetableActivity2: TimetableActivityItemLegacy,
  ): boolean {
    return (
      timetableActivity1.roomName === timetableActivity2.roomName &&
      timetableActivity1.subjectItem.name === timetableActivity2.subjectItem.name &&
      timetableActivity1.startHour === timetableActivity2.startHour &&
      timetableActivity1.weekParity === timetableActivity2.weekParity &&
      new Date(timetableActivity1.date).getTime() === new Date(timetableActivity2.date).getTime()
    );
  }
}
