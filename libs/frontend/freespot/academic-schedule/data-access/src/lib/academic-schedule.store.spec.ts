import { describe, expect, it, beforeEach, Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { of } from 'rxjs';
import { AcademicScheduleStore } from './academic-schedule.store';
import { HttpAcademicScheduleService } from './http-academic-schedule.service';
import { AuthService } from '@free-spot/core/data-access';
import type { TimetableActivity } from '@free-spot/shared/domain';

type TestUser = {
  semigroupCohortId?: string | null;
  groupCohortId?: string | null;
};
describe('AcademicScheduleStore', () => {
  let store: AcademicScheduleStore;
  let authUserSignal: WritableSignal<TestUser | null>;
  let loadScheduleMock: Mock;

  beforeEach(() => {
    authUserSignal = signal(null);
    loadScheduleMock = vi.fn(() =>
      of({
        activities: [],
        subjects: [],
        rooms: [],
      })
    );

    TestBed.configureTestingModule({
      providers: [AcademicScheduleStore,
        {
          provide: HttpAcademicScheduleService,
          useValue: {
            loadSchedule$: loadScheduleMock
          }
        },
        {
          provide: AuthService,
          useValue: {
            userSignal: authUserSignal
          }
        }
      ]
    });

    store = TestBed.inject(AcademicScheduleStore);
  });

  it('should expose loaded subjects and rooms after init', () => {
    loadScheduleMock.mockReturnValue(
      of({
        activities: [],
        subjects: [{ id: 'subject-1', name: 'Math', shortName: 'MATH' }],
        rooms: [{ id: 'room-1', name: 'A101' }],
      })
    );

    store.init();

    expect(store.subjectListSig()).toEqual([{ id: 'subject-1', name: 'Math', shortName: 'MATH' }]);
    expect(store.roomListSig()).toEqual([{ id: 'room-1', name: 'A101' }]);
  });

  it('should return [] when user has no cohort', () => {
    store.init();

    expect(store.timetableActivityListSig()).toHaveLength(0);
  });

  it('should filter activities by semigroupCohortId', () => {

    authUserSignal.set({
      semigroupCohortId: 'semigroup-1',
      groupCohortId: 'group-1',
    });

    const activity1 = {
      id: 'activity-1',
      cohortIds: ['semigroup-1'],
    } as unknown as TimetableActivity;

    loadScheduleMock.mockReturnValue(
      of({
        activities: [
          activity1,
          {
            id: 'activity-2',
            cohortIds: ['other'],
          },
        ],
        subjects: [],
        rooms: [],
      })
    );

    store.init();

    const filteredActivities = store.timetableActivityListSig();

    expect(filteredActivities).toHaveLength(1);
    expect(filteredActivities[0]).toBe(activity1);
  });

  it('should fall back to groupCohortId', () => {
    authUserSignal.set({
      groupCohortId: 'group-1',
    });

    const activity1 = {
      id: 'activity-1',
      cohortIds: ['group-1'],
    } as unknown as TimetableActivity;

    loadScheduleMock.mockReturnValue(
      of({
        activities: [
          activity1,
          {
            id: 'activity-2',
            cohortIds: ['other'],
          },
        ],
        subjects: [],
        rooms: [],
      })
    );

    store.init();

    const filteredActivities = store.timetableActivityListSig();

    expect(filteredActivities).toHaveLength(1);
    expect(filteredActivities[0]).toBe(activity1);
  });

  it('should prefer semigroupCohortId over groupCohortId', () => {
    const semigroupActivity = {
      id: 'semigroup-activity',
      cohortIds: ['semigroup-1'],
    } as unknown as TimetableActivity;

    const groupActivity = {
      id: 'group-activity',
      cohortIds: ['group-1'],
    } as unknown as TimetableActivity;

    authUserSignal.set({
      semigroupCohortId: 'semigroup-1',
      groupCohortId: 'group-1',
    });

    loadScheduleMock.mockReturnValue(
      of({
        activities: [semigroupActivity, groupActivity],
        subjects: [],
        rooms: [],
      })
    );

    store.init();

    expect(store.timetableActivityListSig()).toEqual([semigroupActivity]);
  });
})
