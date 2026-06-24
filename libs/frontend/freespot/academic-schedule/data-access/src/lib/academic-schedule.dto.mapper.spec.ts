import { describe, expect, it } from 'vitest';
import type {
  ActivityTypeDTO,
  TimetableActivityResponseDTO,
  WeekDayDTO,
  WeekParityDTO,
} from '@free-spot/api-client';
import { timetableActivityDtoToDomain } from './academic-schedule.dto.mapper';
describe('academicScheduleDtoMapper', () => {

  it('should map timetable activity dto to domain model', () => {
    const dto: TimetableActivityResponseDTO = {
      id: '1',
      roomId: '1',
      subjectId: '1',
      date: '01.01.2022',
      weekDay: 'FRIDAY' as WeekDayDTO,
      activityType: 'COURSE' as ActivityTypeDTO,
      cohortIds: ['1'],
      startHour: 1,
      endHour: 2,
      weekParity: 'BOTH' as WeekParityDTO,
      capacity: 21,
      reservedSpots: 1,
      busySpots: 1,
      freeSpots: 1,
    };

    const result = timetableActivityDtoToDomain(dto);

    expect(result).toEqual({
      id: '1',
      roomId: '1',
      subjectId: '1',
      date: '01.01.2022',
      weekDay: 'FRIDAY',
      activityType: 'COURSE',
      cohortIds: ['1'],
      startHour: 1,
      endHour: 2,
      weekParity: 'BOTH',
      capacity: 21,
      reservedSpots: 1,
      busySpots: 1,
      freeSpots: 1,
    });
  });

  it('should throw when weekDay is missing', () => {
    const dto = {
      id: '1',
      roomId: '1',
      subjectId: '1',
      date: '01.01.2022',
      weekDay: undefined,
      activityType: 'COURSE' as ActivityTypeDTO,
      cohortIds: ['1'],
      startHour: 1,
      endHour: 2,
      weekParity: 'BOTH' as WeekParityDTO,
      capacity: 21,
      reservedSpots: 1,
      busySpots: 1,
      freeSpots: 1,
    } as unknown as TimetableActivityResponseDTO;

    expect(() => timetableActivityDtoToDomain(dto)).toThrow();
  });

  it('should throw when activityType is undefined', () => {
    const dto = {
      id: '1',
      roomId: '1',
      subjectId: '1',
      date: '01.01.2022',
      weekDay: 'FRIDAY' as WeekDayDTO,
      activityType: undefined,
      cohortIds: ['1'],
      startHour: 1,
      endHour: 2,
      weekParity: 'BOTH' as WeekParityDTO,
      capacity: 21,
      reservedSpots: 1,
      busySpots: 1,
      freeSpots: 1,
    } as unknown as TimetableActivityResponseDTO;

    expect(() => timetableActivityDtoToDomain(dto)).toThrow();
  });

  it('should throw when weekParity is undefined', () => {
    const dto = {
      id: '1',
      roomId: '1',
      subjectId: '1',
      date: '01.01.2022',
      weekDay: 'FRIDAY' as WeekDayDTO,
      activityType: 'COURSE' as ActivityTypeDTO,
      cohortIds: ['1'],
      startHour: 1,
      endHour: 2,
      weekParity: undefined,
      capacity: 21,
      reservedSpots: 1,
      busySpots: 1,
      freeSpots: 1,
    } as unknown as TimetableActivityResponseDTO;

    expect(() => timetableActivityDtoToDomain(dto)).toThrow();
  });

  it('should default to empty array when cohortIds is undefined', () => {
    const dto = {
      id: '1',
      roomId: '1',
      subjectId: '1',
      date: '01.01.2022',
      weekDay: 'FRIDAY' as WeekDayDTO,
      activityType: 'COURSE' as ActivityTypeDTO,
      startHour: 1,
      endHour: 2,
      weekParity: 'BOTH' as WeekParityDTO,
      capacity: 21,
      reservedSpots: 1,
      busySpots: 1,
      freeSpots: 1,
    } as unknown as TimetableActivityResponseDTO;

    const result = timetableActivityDtoToDomain(dto);

    expect(result).toEqual({
      id: '1',
      roomId: '1',
      subjectId: '1',
      date: '01.01.2022',
      weekDay: 'FRIDAY' as WeekDayDTO,
      activityType: 'COURSE' as ActivityTypeDTO,
      cohortIds: [],
      startHour: 1,
      endHour: 2,
      weekParity: 'BOTH' as WeekParityDTO,
      capacity: 21,
      reservedSpots: 1,
      busySpots: 1,
      freeSpots: 1,
    });
  });
});
