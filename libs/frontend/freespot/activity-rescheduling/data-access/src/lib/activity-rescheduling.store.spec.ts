import { describe, it, expect, Mock } from "vitest";
import { ActivityReschedulingStore } from './activity-rescheduling.store';
import { of, firstValueFrom } from "rxjs";
import { TestBed } from "@angular/core/testing";
import { HttpActivityReschedulingService } from './http-activity-rescheduling.service';


describe('ActivityReschedulingStore', () => {
  let store: ActivityReschedulingStore;
  let loadActivityReschedulingContextMock: Mock;
  let rescheduleBookingMock: Mock;
  let getRescheduleOptionsMock: Mock;

  beforeEach(() => {
    loadActivityReschedulingContextMock = vi.fn(() =>
      of({
        bookings: [],
        subjects: [],
        activities: [],
        rooms: [],
        buildings: [],
        floors: [],
      })
    );

    rescheduleBookingMock = vi.fn(() => of(true));
    getRescheduleOptionsMock = vi.fn(() => of({ items: [] }));

    TestBed.configureTestingModule({
      providers: [
        ActivityReschedulingStore,
        {
          provide: HttpActivityReschedulingService,
          useValue: {
            loadActivityReschedulingContext$: loadActivityReschedulingContextMock,
            getRescheduleOptions$: getRescheduleOptionsMock,
            rescheduleBooking$: rescheduleBookingMock,
          }
        },
      ]
    });

    store = TestBed.inject(ActivityReschedulingStore);
  });


  it('should expose bookings, subjects, activities, rooms, floors, buildings after load', () => {
    loadActivityReschedulingContextMock.mockReturnValue(
      of({
        bookings: [{ id: '1' }],
        subjects: [{ id: '1', name: 'subj' }],
        activities: [{ id: '1' }],
        rooms: [{ id: 'room-1', name: 'A101' }],
        buildings: [{ id: 'buid-1', name: 'A1' }],
        floors: [{ id: 'floor-1', name: 'A11' }]
      })
    );


    store.load();

    expect(store.bookings()).toEqual([{ id: '1' }]);
    expect(store.subjects()).toEqual([{ id: '1', name: 'subj' }]);
    expect(store.activities()).toEqual([{ id: '1' }]);
    expect(store.rooms()).toEqual([{ id: 'room-1', name: 'A101' }]);
    expect(store.buildings()).toEqual([{ id: 'buid-1', name: 'A1' }]);
    expect(store.floors()).toEqual([{ id: 'floor-1', name: 'A11' }]);

  });

  it('should expose empty state initially', () => {
    store.load();

    expect(store.bookings()).toEqual([]);
    expect(store.subjects()).toEqual([]);
    expect(store.activities()).toEqual([]);
    expect(store.rooms()).toEqual([]);
    expect(store.buildings()).toEqual([]);
    expect(store.floors()).toEqual([]);
  });

  it('should call the API once when load is called', () => {
    store.load();

    expect(loadActivityReschedulingContextMock).toHaveBeenCalledOnce();
  });

  it('should clear reschedule options when selectBooking is called with null', () => {
    store.selectBooking(null);

    expect(store.rescheduleOptions()).toBeNull();
  });


  it('should not call the API when loadOptions is called without a selected booking', () => {
    store.loadOptions();

    expect(getRescheduleOptionsMock).not.toHaveBeenCalled();
  });

  it('should load reschedule options for the selected booking', () => {
    store.selectBooking('1');

    store.loadOptions();

    expect(getRescheduleOptionsMock).toHaveBeenCalledWith('1');

  });

  it('should clear reschedule options when clearOptions is called', () => {
    getRescheduleOptionsMock.mockReturnValue(
      of({
        items: [{ id: '1' }],
      })
    );

    store.selectBooking('1');
    store.loadOptions();

    expect(store.rescheduleOptions()).not.toBeNull();

    store.clearOptions();

    expect(store.rescheduleOptions()).toBeNull();
  });


  it('should return false when rescheduleBooking is called without a selected booking', async () => {
    const result = await firstValueFrom(
      store.rescheduleBooking('1')
    );

    expect(result).toBe(false);
  });


  it('should call the reschedule API with the selected booking id and activity id', async () => {
    store.selectBooking('1');

    await firstValueFrom(
      store.rescheduleBooking('2')
    );

    expect(rescheduleBookingMock).toHaveBeenCalledWith(
      '1',
      { activityId: '2' }
    );
  });


  it('should reload the context after a successful reschedule', async () => {
    store.selectBooking('1');

    await firstValueFrom(
      store.rescheduleBooking('2')
    );

    expect(rescheduleBookingMock).toHaveBeenCalledOnce();
    expect(loadActivityReschedulingContextMock).toHaveBeenCalledOnce();
    expect(rescheduleBookingMock.mock.invocationCallOrder[0])
      .toBeLessThan(loadActivityReschedulingContextMock.mock.invocationCallOrder[0]);
  });


  it('should clear the selected booking after a successful reschedule', async () => {

    store.selectBooking('1');

    await firstValueFrom(
      store.rescheduleBooking('2')
    );

    store.loadOptions();

    expect(getRescheduleOptionsMock).not.toHaveBeenCalled();
  });


  it('should return true after a successful reschedule', async () => {
    store.selectBooking('1');

    const result = await firstValueFrom(
      store.rescheduleBooking('1')
    );

    expect(rescheduleBookingMock).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });

});
