import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import {
  type AdminTimetableActivity,
  type AdminTimetablingBooking,
  type AdminTimetablingRoom,
  type AdminTimetablingSubject,
  type AdminTimetablingUser,
  type UpdateAdminTimetableActivityCmd,
  type UpdateAdminTimetablingUserCmd,
} from '@free-spot/admin-timetabling/domain';
import { HttpAdminTimetablingService } from './http-admin-timetabling.service';
import { WeekDay } from '@free-spot/shared/domain';

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

  getRoomById(id: string): Signal<AdminTimetablingRoom | undefined> {
    return computed(() => this.roomsSig().find((room) => room.id === id));
  }

  getSubjectById(id: string): Signal<AdminTimetablingSubject | undefined> {
    return computed(() => this.subjectsSig().find((subject) => subject.id === id));
  }

  getActivityById(id: string): Signal<AdminTimetableActivity | undefined> {
    return computed(() => this.activitiesSig().find((activity) => activity.id === id));
  }

  selectTimetableActivityListByCohortId(cohortId: string): Signal<AdminTimetableActivity[]> {
    return computed(() => this.activitiesSig().filter((activity) => activity.cohortIds.includes(cohortId)));
  }

  selectTimetableActivityListBySubjectIdAndWeekDay(
    subjectId: string,
    weekDay: WeekDay,
  ): Signal<AdminTimetableActivity[]> {
    return computed(() =>
      this.activitiesSig().filter(
        (activity) =>
          activity.subjectId === subjectId &&
          activity.weekDay === weekDay &&
          activity.activityType !== 'SPECIAL_EVENT',
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
      this.usersSig.update((users) => users.map((user) => (user.id === id ? updatedUser : user)));
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
