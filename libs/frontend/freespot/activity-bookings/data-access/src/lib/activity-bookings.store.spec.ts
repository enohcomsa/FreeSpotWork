import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { HttpActivityBookingsService } from './http-activity-bookings.service';
import { ActivityBookingsStore } from './activity-bookings.store';

describe('ActivityBookingsStore', () => {
  let store: ActivityBookingsStore;
  let loadActivityBookingsContextMock: Mock;

  beforeEach(() => {
    TestBed.resetTestingModule();

    loadActivityBookingsContextMock = vi.fn(() =>
      of({
        bookings: [],
        subjects: [],
        timetableActivities: [],
        rooms: [],
        buildings: [],
        floors: [],
      })
    );

    TestBed.configureTestingModule({
      providers: [ActivityBookingsStore,
        {
          provide: HttpActivityBookingsService,
          useValue: {
            loadActivityBookingsContext$: loadActivityBookingsContextMock
          }
        }
      ]
    });

    store = TestBed.inject(ActivityBookingsStore);
  });

  it('should expose subjects, activities, rooms, buildings and floors after load', () => {
    loadActivityBookingsContextMock.mockReturnValue(
      of({
        bookings: [],
        subjects: [{ id: '1', name: 'subj' }],
        timetableActivities: [{ id: '1' }],
        rooms: [{ id: 'room-1', name: 'A101' }],
        buildings: [{ id: 'buid-1', name: 'A1' }],
        floors: [{ id: 'floor-1', name: 'A11' }],
      }),
    );

    store.load();

    expect(store.subjects()).toEqual([{ id: '1', name: 'subj' }]);
    expect(store.activities()).toEqual([{ id: '1' }]);
    expect(store.rooms()).toEqual([{ id: 'room-1', name: 'A101' }]);
    expect(store.buildings()).toEqual([{ id: 'buid-1', name: 'A1' }]);
    expect(store.floors()).toEqual([{ id: 'floor-1', name: 'A11' }]);
  });

  it('should expose empty state when the API returns no data', () => {
    store.load();

    expect(store.subjects()).toEqual([]);
    expect(store.activities()).toEqual([]);
    expect(store.rooms()).toEqual([]);
    expect(store.buildings()).toEqual([]);
    expect(store.floors()).toEqual([]);
  });

  it('should expose visible bookings after load', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    loadActivityBookingsContextMock.mockReturnValue(
      of({
        bookings: [
          {
            id: 'booking-1',
            activityId: 'activity-1',
            activityType: 'LABORATORY',
          },
        ],
        timetableActivities: [
          {
            id: 'activity-1',
            roomId: 'room-1',
            subjectId: 'subject-1',
            date: tomorrow.toISOString().split('T')[0],
            weekDay: 'MONDAY',
            activityType: 'LABORATORY',
            cohortIds: [],
            startHour: 10,
            endHour: 12,
            weekParity: 'BOTH',
            capacity: 30,
            reservedSpots: 10,
            busySpots: 10,
            freeSpots: 20,
          },
        ],
        subjects: [],
        rooms: [],
        buildings: [],
        floors: [],
      }),
    );

    store.load();

    expect(store.visibleBookings()).toEqual([
      {
        id: 'booking-1',
        activityId: 'activity-1',
        activityType: 'LABORATORY',
      },
    ]);
  });

  it('should expose empty subjects, activities, rooms, buildings and floors when no data is returned', () => {
    loadActivityBookingsContextMock.mockReturnValue(
      of({
        bookings: [],
        subjects: [],
        timetableActivities: [],
        rooms: [],
        buildings: [],
        floors: [],
      }),
    );

    store.load();

    expect(store.subjects()).toEqual([]);
    expect(store.activities()).toEqual([]);
    expect(store.rooms()).toEqual([]);
    expect(store.buildings()).toEqual([]);
    expect(store.floors()).toEqual([]);
  });

  it('should reload data when refresh is called', () => {
    const loadSpy = vi.spyOn(store, 'load');

    store.refresh();

    expect(loadSpy).toHaveBeenCalledOnce();
  });

  it('should call the API once when load is called', () => {
    store.load();

    expect(loadActivityBookingsContextMock).toHaveBeenCalledOnce();
  });
})
