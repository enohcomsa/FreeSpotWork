import { computed, DestroyRef, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { CreateFacultyCmd, Faculty, UpdateFacultyCmd } from '@free-spot-domain/faculty';
import { FacultyLegacy, GroupLegacy, SemiGroup, TimetableActivityItemLegacy, TimeTableItemLecagy, Year } from '@free-spot/models';
import { SignalArrayUtil } from '@free-spot/util';
import { HttpFacultyService } from '@http-free-spot/faculty';
import { Observable, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root',
})
export class AdminFacultyService {
  private _httpFacultyService: HttpFacultyService = inject(HttpFacultyService);
  private readonly _destroyRef = inject(DestroyRef);

  /** @deprecated Legacy Firebase-era state. */
  private _facultyListSigLegacy: WritableSignal<FacultyLegacy[]> = signal([]);
  private _facultyListSig: WritableSignal<Faculty[]> = signal([]);

  /** @deprecated Legacy Firebase-era state. */
  facultyListSigLegacy = this._facultyListSigLegacy.asReadonly();
  facultyListSig = this._facultyListSig.asReadonly();

  init(): void {
    /** @deprecated Legacy Firebase-era fetch. */
    if (!this._facultyListSigLegacy().length) {
      this._httpFacultyService
        .getFacultyList()
        .pipe(take(1))
        .subscribe((facultyList: FacultyLegacy[]) => {
          this._facultyListSigLegacy.set(facultyList?.filter((faculty: FacultyLegacy) => faculty !== null));
        });
    }

    if (!this._facultyListSig().length) {
      this._httpFacultyService
        .listFaculties$()
        .pipe(take(1))
        .subscribe((facultyList: Faculty[]) => {
          this._facultyListSig.set(facultyList);
        });
    }
  }

  getSignalById(id: string): Signal<Faculty> {
    return computed(() => this.facultyListSig().find((faculty: Faculty) => faculty.id === id) || ({} as Faculty))
  }

  getById(id: string): Observable<Faculty> {
    return this._httpFacultyService.getFacultyById$(id);
  }

  create(input: CreateFacultyCmd): void {
    this._httpFacultyService.createFaculty$(input)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(created => SignalArrayUtil.upsertBy('id', created, this._facultyListSig));
  }

  update(id: string, patch: UpdateFacultyCmd): void {
    this._httpFacultyService.updateFaculty$(id, patch)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(updated => SignalArrayUtil.upsertBy('id', updated, this._facultyListSig));
  }

  remove(id: string): void {
    this._httpFacultyService.deleteFaculty$(id)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => SignalArrayUtil.removeBy('id', id, this._facultyListSig));
  }

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  getFacultyByName(facultyName: string): Signal<FacultyLegacy> {
    return computed(() => this._facultyListSigLegacy().find((faculty: FacultyLegacy) => faculty.name === facultyName) || ({} as FacultyLegacy));
  }

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  getFacultyByGroupName(groupName: string): Signal<FacultyLegacy> {
    return computed(
      () =>
        this.facultyListSigLegacy().find((faculty: FacultyLegacy) => {
          return faculty.yearList
            ?.map((year: Year) => year.yearGroupList?.some((group: GroupLegacy) => group.name === groupName))
            .some((checkedYear: boolean) => checkedYear === true);
        }) || ({} as FacultyLegacy),
    );
  }

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  getGroupByName(groupName: string): Signal<GroupLegacy> {
    return computed(() => {
      let foundGroup: GroupLegacy = {} as GroupLegacy;
      this.facultyListSigLegacy()?.forEach((faculty: FacultyLegacy) =>
        faculty.yearList?.forEach((year: Year) =>
          year.yearGroupList.forEach((group: GroupLegacy) => {
            if (group.name === groupName) {
              foundGroup = group;
            }
          }),
        ),
      );

      return foundGroup;
    });
  }

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  removeDeletedTimetableActivity(removedTimetableActivity: TimetableActivityItemLegacy): void {
    const newFacultyList: FacultyLegacy[] = this._facultyListSigLegacy().map((faculty: FacultyLegacy) => {
      return {
        ...faculty,
        yearList:
          faculty.yearList?.map((year: Year) => {
            return {
              ...year,
              yearGroupList:
                year.yearGroupList?.map((group: GroupLegacy) =>
                  this._removeTimetableActivityFromGroup(group, removedTimetableActivity),
                ) || [],
            };
          }) || [],
      };
    });
    this._facultyListSigLegacy.set(newFacultyList);
    this._httpFacultyService.storeFacultyList(this._facultyListSigLegacy());
  }

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  removeTimetableActivitiesByRoomName(deletedRoomName: string): void {
    const newFacultyList: FacultyLegacy[] = this._facultyListSigLegacy().map((faculty: FacultyLegacy) => {
      return {
        ...faculty,
        yearList:
          faculty.yearList?.map((year: Year) => {
            return {
              ...year,
              yearGroupList:
                year.yearGroupList?.map((group: GroupLegacy) => this._removeRoomTimetableActivity(group, deletedRoomName)) || [],
            };
          }) || [],
      };
    });
    this._facultyListSigLegacy.set(newFacultyList);
    this._httpFacultyService.storeFacultyList(this._facultyListSigLegacy());
  }

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  updateTimetableActivitySpots(changedTimetableActivity: TimetableActivityItemLegacy, addingBooking: boolean): void {
    const newFacultyList: FacultyLegacy[] = this._facultyListSigLegacy().map((faculty: FacultyLegacy) => {
      return {
        ...faculty,
        yearList:
          faculty.yearList?.map((year: Year) => {
            return {
              ...year,
              yearGroupList:
                year.yearGroupList?.map((group: GroupLegacy) =>
                  this._updateTimetableActivityFromGroup(group, changedTimetableActivity, addingBooking),
                ) || [],
            };
          }) || [],
      };
    });

    this._facultyListSigLegacy.set(newFacultyList);
    this._httpFacultyService.storeFacultyList(this._facultyListSigLegacy());
  }

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  addFaculty(newFaculty: FacultyLegacy): void {
    SignalArrayUtil.addItem(newFaculty, this._facultyListSigLegacy);
    this._httpFacultyService.storeFacultyList(this._facultyListSigLegacy());
  }

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  updateFaculty(oldFaculty: FacultyLegacy, updatedFaculty: FacultyLegacy): void {
    SignalArrayUtil.replaceItem(oldFaculty, this._facultyListSigLegacy, updatedFaculty);
    this._httpFacultyService.storeFacultyList(this._facultyListSigLegacy());
  }

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  deleteFaculty(deletedFaculty: FacultyLegacy): void {
    SignalArrayUtil.deleteItem(deletedFaculty, this._facultyListSigLegacy);
    this._httpFacultyService.storeFacultyList(this._facultyListSigLegacy());
  }

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  private _removeTimetableActivityFromGroup(group: GroupLegacy, removedTimetableActivity: TimetableActivityItemLegacy): GroupLegacy {
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

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  private _removeRoomTimetableActivity(group: GroupLegacy, deletedRoomName: string): GroupLegacy {
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

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
  private _updateTimetableActivityFromGroup(
    group: GroupLegacy,
    changedTimetableActivity: TimetableActivityItemLegacy,
    addingBooking: boolean,
  ): GroupLegacy {
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

   /**
   * @deprecated Legacy faculty lookup by name; remove after migration.
   */
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
