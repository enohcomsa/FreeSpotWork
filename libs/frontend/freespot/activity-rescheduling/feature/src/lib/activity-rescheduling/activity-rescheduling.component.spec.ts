import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ActivityReschedulingComponent } from './activity-rescheduling.component';
import { ActivityReschedulingStore } from '@free-spot/activity-rescheduling/data-access';
import { ConfirmModalService } from '@free-spot/shared/ui';
import { ToastrService } from 'ngx-toastr';

import {
  ActivityReschedulingActivity,
  ActivityReschedulingBooking,
  ActivityReschedulingBuilding,
  ActivityReschedulingFloor,
  ActivityReschedulingOptionsResult,
  ActivityReschedulingRoom,
  ActivityReschedulingSubject,
} from '@free-spot/activity-rescheduling/domain';

describe('ActivityReschedulingComponent', () => {
  let fixture: ComponentFixture<ActivityReschedulingComponent>;
  let component: ActivityReschedulingComponent;

  const loadMock = vi.fn();
  const clearOptionsMock = vi.fn();
  const selectBookingMock = vi.fn();
  const loadOptionsMock = vi.fn();
  const rescheduleBookingMock = vi.fn(() => of(true));
  const openConfirmDialogMock = vi.fn(() => ({
    afterClosed: () => of(true),
  }));
  const toastrSuccessMock = vi.fn();

  const initialBookings: ActivityReschedulingBooking[] = [
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
  ];

  const initialActivities: ActivityReschedulingActivity[] = [
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
      roomId: 'room-1',
      subjectId: 'subject-1',
      date: '2012-01-02',
      weekDay: 'MONDAY',
      activityType: 'LABORATORY',
      cohortIds: [],
      startHour: 14,
      endHour: 16,
      weekParity: 'EVEN',
      capacity: 30,
      reservedSpots: 5,
      busySpots: 5,
      freeSpots: 25,
    },
  ];

  const initialSubjects: ActivityReschedulingSubject[] = [
    {
      id: 'subject-1',
      name: 'Mathematics',
      shortName: 'Math',
    },
  ];

  const initialRooms: ActivityReschedulingRoom[] = [
    {
      id: 'room-1',
      buildingId: 'building-1',
      floorId: 'floor-1',
      name: 'Room 1',
      totalSpotsNumber: 30,
      unavailableSpots: 0,
      subjectList: [],
    },
  ];

  const initialBuildings: ActivityReschedulingBuilding[] = [
    {
      id: 'building-1',
      name: 'Building 1',
      address: 'Address 1',
    },
  ];

  const initialFloors: ActivityReschedulingFloor[] = [
    {
      id: 'floor-1',
      buildingId: 'building-1',
      name: 'Floor 1',
    },
  ];

  const initialOptions: ActivityReschedulingOptionsResult = {
    items: [
      {
        activityId: 'activity-2',
        freeSpots: 25,
      },
    ],
  };

  const reschedulableBookings = signal<ActivityReschedulingBooking[]>([]);
  const rescheduleOptions = signal<ActivityReschedulingOptionsResult | null>(null);
  const activities = signal<ActivityReschedulingActivity[]>([]);
  const subjects = signal<ActivityReschedulingSubject[]>([]);
  const rooms = signal<ActivityReschedulingRoom[]>([]);
  const buildings = signal<ActivityReschedulingBuilding[]>([]);
  const floors = signal<ActivityReschedulingFloor[]>([]);

  beforeEach(async () => {
    vi.clearAllMocks();

    reschedulableBookings.set([...initialBookings]);
    rescheduleOptions.set(null);
    activities.set([...initialActivities]);
    subjects.set([...initialSubjects]);
    rooms.set([...initialRooms]);
    buildings.set([...initialBuildings]);
    floors.set([...initialFloors]);

    await TestBed.configureTestingModule({
      imports: [
        ActivityReschedulingComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        {
          provide: ActivityReschedulingStore,
          useValue: {
            load: loadMock,
            clearOptions: clearOptionsMock,
            selectBooking: selectBookingMock,
            loadOptions: loadOptionsMock,
            rescheduleBooking: rescheduleBookingMock,
            reschedulableBookings,
            rescheduleOptions,
            activities,
            subjects,
            rooms,
            buildings,
            floors,
          },
        },
        {
          provide: ConfirmModalService,
          useValue: {
            openConfirmDialog: openConfirmDialogMock,
          },
        },
        {
          provide: ToastrService,
          useValue: {
            success: toastrSuccessMock,
          },
        },
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityReschedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load context on init', () => {
    expect(loadMock).toHaveBeenCalledOnce();
  });

  it('should render booking input', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-automation-id="booking-input"]'
    );

    expect(input).toBeTruthy();
  });

  it('should render disabled search button initially', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-automation-id="search-button"]'
    );

    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('DYNAMIC_FORM.SEARCH');
  });

  it('should render booking selection hint when search is inactive', () => {
    const hint: HTMLElement = fixture.nativeElement.querySelector(
      '[data-automation-id="booking-selection-hint"]'
    );

    expect(hint.textContent).toContain('DYNAMIC_FORM.SELECT_BOOKING_HINT');
  });

  it('should clear options and selected booking when query changes manually', () => {
    component.bookingForm.patchValue({ bookingQuery: 'Math' });

    expect(component.bookingQuery()).toBe('Math');
    expect(component.searchActive()).toBe(false);
    expect(clearOptionsMock).toHaveBeenCalled();
    expect(selectBookingMock).toHaveBeenCalledWith(null);
  });

  it('should select booking from autocomplete', () => {
    component.onBookingSelected({
      option: {
        value: 'booking-1',
      },
    } as never);

    expect(selectBookingMock).toHaveBeenCalledWith('booking-1');
    expect(component.bookingQuery()).toContain('LABORATORY');
    expect(component.bookingForm.controls.bookingQuery.value).toContain('LABORATORY');
    expect(component.canSearch()).toBe(true);
  });

  it('should load options and activate search on submit', () => {
    component.onSubmit();

    expect(loadOptionsMock).toHaveBeenCalledOnce();
    expect(component.searchActive()).toBe(true);
  });

  it('should render option cards when search is active and options exist', () => {
    rescheduleOptions.set(initialOptions);
    component.searchActive.set(true);

    fixture.detectChanges();

    const cards: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[data-automation-id="reschedule-option-card"]')
    );

    expect(cards).toHaveLength(1);
  });

  it('should render no free spots message when search is active and no options exist', () => {
    rescheduleOptions.set({ items: [] });
    component.searchActive.set(true);

    fixture.detectChanges();

    const message: HTMLElement = fixture.nativeElement.querySelector(
      '[data-automation-id="no-free-spots-message"]'
    );

    expect(message.textContent).toContain('DYNAMIC_FORM.NO_FREE_SPOTS');
  });

  it('should filter booking options by query', () => {
    component.bookingForm.patchValue({ bookingQuery: 'math' });

    expect(component.filteredBookingOptions()).toHaveLength(1);
  });

  it('should apply selected booking input change', () => {
    fixture.componentRef.setInput('selectedBookingId', 'booking-1');
    fixture.detectChanges();

    expect(selectBookingMock).toHaveBeenCalledWith('booking-1');
    expect(loadOptionsMock).toHaveBeenCalledOnce();
    expect(component.searchActive()).toBe(true);
    expect(component.bookingForm.controls.bookingQuery.value).toContain('LABORATORY');
  });

  it('should reschedule booking when confirmed', () => {
    component.onBook('activity-2');

    expect(openConfirmDialogMock).toHaveBeenCalledWith('COMMON.CONFIRM_RESCHEDULE_BOOKING');
    expect(rescheduleBookingMock).toHaveBeenCalledWith('activity-2');
    expect(toastrSuccessMock).toHaveBeenCalled();
    expect(component.searchActive()).toBe(false);
  });

  it('should emit rescheduled after successful reschedule', () => {
    let emitted = false;

    component.rescheduled.subscribe(() => {
      emitted = true;
    });

    component.onBook('activity-2');

    expect(emitted).toBe(true);
  });

  it('should not reschedule when confirmation is cancelled', () => {
    openConfirmDialogMock.mockReturnValueOnce({
      afterClosed: () => of(false),
    });

    component.onBook('activity-2');

    expect(rescheduleBookingMock).not.toHaveBeenCalled();
    expect(toastrSuccessMock).not.toHaveBeenCalled();
  });

  it('should not reset form when reschedule fails', () => {
    rescheduleBookingMock.mockReturnValueOnce(of(false));
    component.searchActive.set(true);
    component.bookingForm.patchValue({ bookingQuery: 'Math' }, { emitEvent: false });

    component.onBook('activity-2');

    expect(toastrSuccessMock).not.toHaveBeenCalled();
    expect(component.searchActive()).toBe(true);
    expect(component.bookingForm.controls.bookingQuery.value).toBe('Math');
  });
});
