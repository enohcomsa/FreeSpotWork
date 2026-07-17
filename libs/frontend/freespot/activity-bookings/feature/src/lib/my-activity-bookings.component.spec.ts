import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';

import { MyActivityBookingsComponent } from './my-activity-bookings.component';
import { ActivityBookingsStore } from '@free-spot/activity-bookings/data-access';
import { ActivityBooking, ActivityBookingActivity } from '@free-spot/activity-bookings/domain';

describe('MyActivityBookingsComponent', () => {
  let fixture: ComponentFixture<MyActivityBookingsComponent>;
  let component: MyActivityBookingsComponent;

  const loadMock = vi.fn();
  const refreshMock = vi.fn();
  const setBookingRangeFiltersMock = vi.fn();

  const initialVisibleBookings: ActivityBooking[] = [
    {
      id: 'booking-1',
      activityId: 'activity-1',
      userId: 'user-1',
      facultyId: null,
      programId: null,
      programYearId: null,
      groupCohortId: null,
      semigroupCohortId: null,
      subjectId: 'subject-1',
      activityType: 'LABORATORY',
      status: 'CONFIRMED',
      originalActivityId: null,
      isRescheduled: null,
      rescheduledAt: null,
      createdAt: '2012-01-01T00:00:00.000Z',
      updatedAt: null,
    },
    {
      id: 'booking-2',
      activityId: 'activity-2',
      userId: 'user-2',
      facultyId: null,
      programId: null,
      programYearId: null,
      groupCohortId: null,
      semigroupCohortId: null,
      subjectId: 'subject-2',
      activityType: 'COURSE',
      status: 'CONFIRMED',
      originalActivityId: null,
      isRescheduled: null,
      rescheduledAt: null,
      createdAt: '2012-01-02T00:00:00.000Z',
      updatedAt: null,
    },
  ];

  const initialActivities: ActivityBookingActivity[] = [
    {
      id: 'activity-1',
      roomId: 'room-1',
      subjectId: 'subject-1',
      date: '2012-01-01',
      weekDay: 'MONDAY',
      activityType: 'LABORATORY',
      cohortIds: [],
      startHour: 10,
      endHour: 12,
      weekParity: 'BOTH',
      capacity: 30,
      reservedSpots: 1,
      busySpots: 1,
      freeSpots: 29,
    },
    {
      id: 'activity-2',
      roomId: 'room-2',
      subjectId: 'subject-2',
      date: '2012-01-02',
      weekDay: 'MONDAY',
      activityType: 'COURSE',
      cohortIds: [],
      startHour: 14,
      endHour: 16,
      weekParity: 'EVEN',
      capacity: 40,
      reservedSpots: 5,
      busySpots: 5,
      freeSpots: 35,
    },
  ];

  const initialSubjects = [
    { id: 'subject-1', name: 'Math' },
    { id: 'subject-2', name: 'Physics' },
  ];

  const initialRooms = [
    {
      id: 'room-1',
      name: 'Room 1',
      buildingId: 'building-1',
      floorId: 'floor-1',
    },
    {
      id: 'room-2',
      name: 'Room 2',
      buildingId: 'building-2',
      floorId: 'floor-2',
    },
  ];

  const initialBuildings = [
    { id: 'building-1', name: 'Building 1' },
    { id: 'building-2', name: 'Building 2' },
  ];

  const initialFloors = [
    { id: 'floor-1', name: 'Floor 1' },
    { id: 'floor-2', name: 'Floor 2' },
  ];

  const visibleBookings = signal<ActivityBooking[]>([]);
  const activities = signal<ActivityBookingActivity[]>([]);
  const subjects = signal(initialSubjects);
  const rooms = signal(initialRooms);
  const buildings = signal(initialBuildings);
  const floors = signal(initialFloors);
  const selectedBookingRanges = signal([]);

  beforeEach(async () => {
    vi.clearAllMocks();

    visibleBookings.set([...initialVisibleBookings]);
    activities.set([...initialActivities]);
    subjects.set([...initialSubjects]);
    rooms.set([...initialRooms]);
    buildings.set([...initialBuildings]);
    floors.set([...initialFloors]);
    selectedBookingRanges.set([]);

    await TestBed.configureTestingModule({
      imports: [
        MyActivityBookingsComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        {
          provide: ActivityBookingsStore,
          useValue: {
            load: loadMock,
            refresh: refreshMock,
            setBookingRangeFilters: setBookingRangeFiltersMock,
            selectedBookingRanges,
            visibleBookings,
            activities,
            subjects,
            rooms,
            buildings,
            floors,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyActivityBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bookings on init', () => {
    expect(loadMock).toHaveBeenCalledOnce();
  });

  it('should render title', () => {
    const title: HTMLHeadingElement = fixture.nativeElement.querySelector('h1[data-automation-id="title"]');

    expect(title.textContent?.trim()).toContain('BOOKINGS_PAGE.MY_BOOKINGS');
  });

  it('should render booking range chips', () => {
    const thisWeekChip: HTMLElement = fixture.nativeElement.querySelector(
      '[data-automation-id="upcoming-this-week-chip"]'
    );
    const pastChip: HTMLElement = fixture.nativeElement.querySelector(
      '[data-automation-id="past-this-week-chip"]'
    );
    const nextWeekChip: HTMLElement = fixture.nativeElement.querySelector(
      '[data-automation-id="next-week-chip"]'
    );

    expect(thisWeekChip.textContent).toContain('BOOKINGS_PAGE.UPCOMING_THIS_WEEK');
    expect(pastChip.textContent).toContain('BOOKINGS_PAGE.PAST_THIS_WEEK');
    expect(nextWeekChip.textContent).toContain('BOOKINGS_PAGE.NEXT_WEEK');
  });

  it('should render activity type chips', () => {
    const typeChips: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[data-automation-id="type-chip"]')
    );

    expect(typeChips).toHaveLength(4);
    expect(typeChips[0].textContent).toContain('BOOKINGS_PAGE.LABORATORY');
    expect(typeChips[1].textContent).toContain('BOOKINGS_PAGE.COURSE');
    expect(typeChips[2].textContent).toContain('BOOKINGS_PAGE.PROJECT');
    expect(typeChips[3].textContent).toContain('BOOKINGS_PAGE.SEMINAR');
  });

  it('should render booking cards', () => {
    const cards: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[data-automation-id="booking-card"]')
    );

    expect(cards).toHaveLength(2);
  });

  it('should render empty message when there are no bookings', () => {
    visibleBookings.set([]);

    fixture.detectChanges();

    const emptyMessage: HTMLElement = fixture.nativeElement.querySelector(
      '[data-automation-id="empty-booking-list"]'
    );

    expect(emptyMessage.textContent).toContain('BOOKINGS_PAGE.NO_BOOKINGS_MSG');
  });

  it('should filter bookings by activity type', () => {
    component.setFilter('LABORATORY');

    fixture.detectChanges();

    const cards: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[data-automation-id="booking-card"]')
    );

    expect(cards).toHaveLength(1);
  });

  it('should show all bookings when filter is cleared', () => {
    component.setFilter('LABORATORY');
    component.setFilter(null);

    fixture.detectChanges();

    const cards: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[data-automation-id="booking-card"]')
    );

    expect(cards).toHaveLength(2);
  });

  it('should call store when booking range filters are changed', () => {
    component.setBookingRangeFilters(['THIS_WEEK_FUTURE']);

    expect(setBookingRangeFiltersMock).toHaveBeenCalledWith(['THIS_WEEK_FUTURE']);
  });

  it('should call store refresh', () => {
    component.refresh();

    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('should emit booking id when booking is selected', () => {
    let emittedId: string | undefined;

    component.bookingSelected.subscribe((id) => {
      emittedId = id;
    });

    component.selectBooking('booking-1');

    expect(emittedId).toBe('booking-1');
  });
});
