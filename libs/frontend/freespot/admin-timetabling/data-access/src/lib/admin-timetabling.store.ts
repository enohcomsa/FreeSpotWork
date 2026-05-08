import { Injectable, Signal, computed, inject, signal } from '@angular/core';

import {
  AdminTimetableActivity,
  AdminTimetableActivityType,
  AdminTimetableWeekDay,
  AdminTimetablingBooking,
  AdminTimetablingRoom,
  AdminTimetablingSubject,
  AdminTimetablingUser,
  UpdateAdminTimetableActivityCmd,
  UpdateAdminTimetablingUserCmd,
} from '@free-spot/admin-timetabling/domain';

import { HttpAdminTimetablingService } from './http-admin-timetabling.service';

@Injectable({ providedIn: 'root' })
export class AdminTimetablingStore {
  private readonly http = inject(HttpAdminTimetablingService);

  private readonly activitiesSig = signal<AdminTimetableActivity[]>([]);
  private readonly roomsSig = signal<AdminTimetablingRoom[]>([]);
  private readonly subjectsSig = signal<AdminTimetablingSubject[]>([]);
  private readonly usersSig = signal<AdminTimetablingUser[]>([]);
  private readonly bookingsSig = signal<AdminTimetablingBooking[]>([]);

  readonly timetableActivityListSig: Signal<AdminTimetableActivity[]> = this.activitiesSig.asReadonly();
  readonly userListSig: Signal<AdminTimetablingUser[]> = this.usersSig.asReadonly();
  readonly bookingListSig: Signal<AdminTimetablingBooking[]> = this.bookingsSig.asReadonly();

  init(): void {
    if (this.activitiesSig().length) {
      return;
    }

    this.http.load$().subscribe(({ activities, rooms, subjects, users, bookings }) => {
      this.activitiesSig.set(activities);
      this.roomsSig.set(rooms);
      this.subjectsSig.set(subjects);
      this.usersSig.set(users);
      this.bookingsSig.set(bookings);
    });
  }

  getRoomById(id: string) {
    return computed(() => this.roomsSig().find((room) => room.id === id));
  }

  getSubjectById(id: string) {
    return computed(() => this.subjectsSig().find((subject) => subject.id === id));
  }

  getActivityById(id: string) {
    return computed(() => this.activitiesSig().find((activity) => activity.id === id));
  }

  selectTimetableActivityListByCohortId(cohortId: string) {
    return computed(() =>
      this.activitiesSig().filter((activity) => activity.cohortIds.includes(cohortId)),
    );
  }

  selectTimetableActivityListBySubjectIdAndWeekDay(
    subjectId: string,
    weekDay: AdminTimetableWeekDay,
  ) {
    return computed(() =>
      this.activitiesSig().filter(
        (activity) =>
          activity.subjectId === subjectId &&
          activity.weekDay === weekDay &&
          activity.activityType !== AdminTimetableActivityType.SpecialEvent,
      ),
    );
  }

  addCohortToActivity(cohortId: string, timetableActivityId: string): void {
    const activity = this.getActivityById(timetableActivityId)();

    if (!activity || activity.cohortIds.includes(cohortId)) {
      return;
    }

    this.updateActivity(timetableActivityId, {
      cohortIds: [...activity.cohortIds, cohortId],
    });
  }

  removeCohortFromActivity(cohortId: string, timetableActivityId: string): void {
    const activity = this.getActivityById(timetableActivityId)();

    if (!activity || !activity.cohortIds.includes(cohortId)) {
      return;
    }

    this.updateActivity(timetableActivityId, {
      cohortIds: activity.cohortIds.filter((id) => id !== cohortId),
    });
  }

  removeCohortFromAllActivities(cohortId: string): void {
    this.activitiesSig()
      .filter((activity) => activity.cohortIds.includes(cohortId))
      .forEach((activity) => {
        this.removeCohortFromActivity(cohortId, activity.id);
      });
  }

  updateUser(id: string, cmd: UpdateAdminTimetablingUserCmd): void {
    this.http.updateUser$(id, cmd).subscribe((updatedUser) => {
      this.usersSig.update((users) =>
        users.map((user) => (user.id === id ? updatedUser : user)),
      );
    });
  }

  private updateActivity(id: string, cmd: UpdateAdminTimetableActivityCmd): void {
    this.http.updateActivity$(id, cmd).subscribe((updatedActivity) => {
      this.activitiesSig.update((activities) =>
        activities.map((activity) => (activity.id === id ? updatedActivity : activity)),
      );
    });
  }
}
