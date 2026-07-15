import { describe, it, expect } from "vitest";
import { bookingDtoToDomain } from './activity-bookings.dto.mapper';
import type { BookingResponseDTO, ActivityTypeDTO, BookingStatusDTO } from '@free-spot/api-client'

describe('bookingDtoToDomain', () => {
  it('should map booking dto to activity booking model', () => {
    const dto = {
      id: '1',
      activityId: '1',
      userId: '1',
      facultyId: '1',
      programId: '1',
      programYearId: '1',
      groupCohortId: '1',
      semigroupCohortId: '1',
      subjectId: '1',
      activityType: 'LABORATORY' as ActivityTypeDTO,
      status: 'WAITLISTED' as BookingStatusDTO,
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '01.01.2021',
      updatedAt: null,
    } as BookingResponseDTO;

    const result = bookingDtoToDomain(dto);

    expect(result).toEqual({
      id: '1',
      activityId: '1',
      userId: '1',
      facultyId: '1',
      programId: '1',
      programYearId: '1',
      groupCohortId: '1',
      semigroupCohortId: '1',
      subjectId: '1',
      activityType: 'LABORATORY',
      status: 'WAITLISTED',
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '01.01.2021',
      updatedAt: null,
    })
  });

  it('should throw if id is undefined', () => {
    const dto = {
      activityId: '1',
      userId: '1',
      facultyId: '1',
      programId: '1',
      programYearId: '1',
      groupCohortId: '1',
      semigroupCohortId: '1',
      subjectId: '1',
      activityType: 'LABORATORY' as ActivityTypeDTO,
      status: 'WAITLISTED' as BookingStatusDTO,
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '01.01.2021',
      updatedAt: null,
    } as unknown as BookingResponseDTO;;

    expect(() => bookingDtoToDomain(dto)).toThrow();
  });

  it('should throw if activity id is undefined', () => {
    const dto = {
      id: '1',
      userId: '1',
      facultyId: '1',
      programId: '1',
      programYearId: '1',
      groupCohortId: '1',
      semigroupCohortId: '1',
      subjectId: '1',
      activityType: 'LABORATORY' as ActivityTypeDTO,
      status: 'WAITLISTED' as BookingStatusDTO,
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '01.01.2021',
      updatedAt: null,
    } as unknown as BookingResponseDTO;;

    expect(() => bookingDtoToDomain(dto)).toThrow();
  });

  it('should throw if user id is undefined', () => {
    const dto = {
      id: '1',
      activityId: '1',
      facultyId: '1',
      programId: '1',
      programYearId: '1',
      groupCohortId: '1',
      semigroupCohortId: '1',
      subjectId: '1',
      activityType: 'LABORATORY' as ActivityTypeDTO,
      status: 'WAITLISTED' as BookingStatusDTO,
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '01.01.2021',
      updatedAt: null,
    } as unknown as BookingResponseDTO;;

    expect(() => bookingDtoToDomain(dto)).toThrow();
  });

  it('should throw if createdAt is undefined', () => {
    const dto = {
      id: '1',
      activityId: '1',
      userId: '1',
      facultyId: '1',
      programId: '1',
      programYearId: '1',
      groupCohortId: '1',
      semigroupCohortId: '1',
      subjectId: '1',
      activityType: 'LABORATORY' as ActivityTypeDTO,
      status: 'WAITLISTED' as BookingStatusDTO,
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      updatedAt: null,
    } as unknown as BookingResponseDTO;;

    expect(() => bookingDtoToDomain(dto)).toThrow();
  });

  it('should throw if activityType is undefined', () => {
    const dto = {
      id: '1',
      activityId: '1',
      userId: '1',
      facultyId: '1',
      programId: '1',
      programYearId: '1',
      groupCohortId: '1',
      semigroupCohortId: '1',
      subjectId: '1',
      status: 'WAITLISTED' as BookingStatusDTO,
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '01.01.2021',
      updatedAt: null,
    } as unknown as BookingResponseDTO;;

    expect(() => bookingDtoToDomain(dto)).toThrow('Missing activity type');
  });

  it('should throw if status is undefined', () => {
    const dto = {
      id: '1',
      activityId: '1',
      userId: '1',
      facultyId: '1',
      programId: '1',
      programYearId: '1',
      groupCohortId: '1',
      semigroupCohortId: '1',
      subjectId: '1',
      activityType: 'LABORATORY' as ActivityTypeDTO,
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '01.01.2021',
    } as unknown as BookingResponseDTO;;

    expect(() => bookingDtoToDomain(dto)).toThrow('Missing booking status');
  });

  it('should default to null for any non required missing property', () => {
    const dto = {
      id: '1',
      activityId: '1',
      userId: '1',
      activityType: 'LABORATORY' as ActivityTypeDTO,
      status: 'WAITLISTED' as BookingStatusDTO,
      createdAt: '01.01.2021',
    } as BookingResponseDTO;

    const result = bookingDtoToDomain(dto);

    expect(result).toEqual({
      id: '1',
      activityId: '1',
      userId: '1',
      facultyId: null,
      programId: null,
      programYearId: null,
      groupCohortId: null,
      semigroupCohortId: null,
      subjectId: null,
      activityType: 'LABORATORY',
      status: 'WAITLISTED',
      originalActivityId: null,
      isRescheduled: null,
      rescheduledAt: null,
      createdAt: '01.01.2021',
      updatedAt: null,
    });
  });
});
