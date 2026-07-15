import { describe, it, expect } from "vitest";
import { bookingDtoToDomain } from './activity-rescheduling.dto.mapper';
import { BookingResponseDTO } from "@free-spot/api-client";
describe('bookingDtoToDomain', () => {


  it('shoud map booking dto to activity rescheduling domain', () => {
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
      activityType: 'LABORATORY',
      status: 'CONFIRMED',
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '21.21.2012',
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
      status: 'CONFIRMED',
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '21.21.2012',
      updatedAt: null,
    })
  });
  it('should throw if activity type id is undefined', () => {
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
      status: 'CONFIRMED',
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '21.21.2012',
      updatedAt: null,
    } as unknown as BookingResponseDTO;

    expect(() => bookingDtoToDomain(dto)).toThrow();

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
      activityType: 'LABORATORY',
      originalActivityId: '1',
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: '21.21.2012',
      updatedAt: null,
    } as unknown as BookingResponseDTO;

    expect(() => bookingDtoToDomain(dto)).toThrow();
  });
  it('should default to null for any non required missing property', () => {
    const dto = {
      id: '1',
      activityId: '1',
      userId: '1',
      activityType: 'LABORATORY',
      status: 'CONFIRMED',
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
      status: 'CONFIRMED',
      originalActivityId: null,
      isRescheduled: null,
      rescheduledAt: null,
      createdAt: null,
      updatedAt: null,
    })
  });
})

