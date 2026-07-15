import { describe, it, expect, Mock } from "vitest";
import { ActivityBookingsStore } from './activity-bookings.store';
import { of } from "rxjs";
import { TestBed } from "@angular/core/testing";
import { HttpActivityBookingsService } from "./http-activity-bookings.service";

describe('ActivityBookingsStore', () => {
  let store: ActivityBookingsStore;
  let loadActivityBookingsContextMock: Mock;

  beforeEach(() => {
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

  it('should should expose subjects, activities, rooms, buildings, floors after load', () => {
    loadActivityBookingsContextMock.mockReturnValue(
      of({
        subjects: [{ id: '1', name: 'subj' }],
        timetableActivities: [{ id: '1' }],
        rooms: [{ id: 'room-1', name: 'A101' }],
        buildings: [{ id: 'buid-1', name: 'A1' }],
        floors: [{ id: 'floor-1', name: 'A11' }]
      })
    );

    store.load();

    expect(store.subjects()).toEqual([{ id: '1', name: 'subj' }]);
    expect(store.activities()).toEqual([{ id: '1' }]);
    expect(store.rooms()).toEqual([{ id: 'room-1', name: 'A101' }]);
    expect(store.buildings()).toEqual([{ id: 'buid-1', name: 'A1' }]);
    expect(store.floors()).toEqual([{ id: 'floor-1', name: 'A11' }]);
  });

  it('should expose empty state initially', () => {
    store.load();

    expect(store.subjects()).toEqual([]);
    expect(store.activities()).toEqual([]);
    expect(store.rooms()).toEqual([]);
    expect(store.buildings()).toEqual([]);
    expect(store.floors()).toEqual([]);
  });

  it('should expose bookings after load', () => {
    loadActivityBookingsContextMock.mockReturnValue(
      of({
        bookings: [{ id: '1' }]
      })
    );

    store.load();

    expect(store.bookings()).toEqual([{ id: '1' }]);
  });

  it('should filter out bookings with activity type SPECIAL_EVENT', () => {
    loadActivityBookingsContextMock.mockReturnValue(
      of({
        bookings: [
          { id: '1', activityType: 'LABORATORY' },
          { id: '1', activityType: 'SPECIAL_EVENT' },
        ],
      })
    );

    store.load();

    expect(store.bookings()).toEqual([{ id: '1', activityType: 'LABORATORY' }]);
  });

  it('should expose an empty bookings list when no bookings are returned', () => {
    loadActivityBookingsContextMock.mockReturnValue(
      of({
        bookings: [

          { id: '1', activityType: 'SPECIAL_EVENT' },
        ],
      })
    );

    store.load();

    expect(store.bookings()).toEqual([]);
  });

  it('should expose empty subjects, activities, rooms, buildings and floors when no data is returned', () => {
    loadActivityBookingsContextMock.mockReturnValue(
      of({
        subjects: [],
        timetableActivities: [],
        rooms: [],
        buildings: [],
        floors: [],
      })
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
