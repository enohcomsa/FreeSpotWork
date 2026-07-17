import { describe, expect, it } from 'vitest';

import {
  mapToReschedulableBookingVm,
  mapToRescheduleOptionCardVm,
} from './activity-rescheduling.vm.mapper';

import {
  ActivityReschedulingActivity,
  ActivityReschedulingBooking,
  ActivityReschedulingBuilding,
  ActivityReschedulingFloor,
  ActivityReschedulingOption,
  ActivityReschedulingRoom,
  ActivityReschedulingSubject,
} from '@free-spot/activity-rescheduling/domain';

describe('reschedulable booking vm mapper', () => {
  const booking: ActivityReschedulingBooking = {
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
  };

  const activity: ActivityReschedulingActivity = {
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
  };

  const subject: ActivityReschedulingSubject = {
    id: 'subject-1',
    name: 'Mathematics',
    shortName: 'Math',
  };

  const room: ActivityReschedulingRoom = {
    id: 'room-1',
    name: 'Room 1',
    buildingId: 'building-1',
    floorId: 'floor-1',
    totalSpotsNumber: 20,
    unavailableSpots: 1,
    subjectList: ['Math'],
  };

  const building: ActivityReschedulingBuilding = {
    id: 'building-1',
    name: 'Building 1',
    address: 'build-1-address',
  };

  const floor: ActivityReschedulingFloor = {
    id: 'floor-1',
    name: 'Floor 1',
    buildingId: 'building-1',
  };

  const option: ActivityReschedulingOption = {
    activityId: 'activity-1',
    freeSpots: 20,
  };

  describe('mapToReschedulableBookingVm', () => {
    it('should map booking to reschedulable booking vm', () => {
      const result = mapToReschedulableBookingVm(booking, [subject], [activity]);

      expect(result.id).toBe('booking-1');
      expect(result.label).toContain('LABORATORY');
      expect(result.label).toContain('Math');
      expect(result.label).toContain('10-12');
    });

    it('should use subject name when short name is missing', () => {
      const result = mapToReschedulableBookingVm(
        booking,
        [{ ...subject, shortName: undefined }],
        [activity]
      );

      expect(result.label).toContain('Mathematics');
    });

    it('should skip missing subject in label', () => {
      const result = mapToReschedulableBookingVm(booking, [], [activity]);

      expect(result).toEqual({
        id: 'booking-1',
        label: expect.stringContaining('LABORATORY'),
      });
    });

    it('should skip missing activity details in label', () => {
      const result = mapToReschedulableBookingVm(booking, [subject], []);

      expect(result).toEqual({
        id: 'booking-1',
        label: 'LABORATORY · Math',
      });
    });
  });

  describe('mapToRescheduleOptionCardVm', () => {
    it('should map reschedule option to card vm', () => {
      const result = mapToRescheduleOptionCardVm(
        option,
        [activity],
        [subject],
        [room],
        [building],
        [floor]
      );

      expect(result).toEqual({
        id: 'activity-1',
        subjectName: 'Math',
        buildingName: 'Building 1',
        floorName: 'Floor 1',
        roomName: 'Room 1',
        date: '2012-01-01',
        startHour: 10,
        endHour: 12,
        freeSpots: 20,
      });
    });

    it('should use subject name when short name is missing', () => {
      const result = mapToRescheduleOptionCardVm(
        option,
        [activity],
        [{ ...subject, shortName: undefined }],
        [room],
        [building],
        [floor]
      );

      expect(result?.subjectName).toBe('Mathematics');
    });

    it('should return null when activity is missing', () => {
      const result = mapToRescheduleOptionCardVm(
        option,
        [],
        [subject],
        [room],
        [building],
        [floor]
      );

      expect(result).toBeNull();
    });

    it('should use empty strings when related entities are missing', () => {
      const result = mapToRescheduleOptionCardVm(
        option,
        [activity],
        [],
        [],
        [],
        []
      );

      expect(result).toEqual({
        id: 'activity-1',
        subjectName: '',
        buildingName: '',
        floorName: '',
        roomName: '',
        date: '2012-01-01',
        startHour: 10,
        endHour: 12,
        freeSpots: 20,
      });
    });
  });
});
