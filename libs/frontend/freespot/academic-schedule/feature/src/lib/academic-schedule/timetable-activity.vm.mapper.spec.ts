import { describe, it, expect } from "vitest";
import type { WeekDay, WeekParity, ActivityType } from "@free-spot/shared/domain";
import type { TimetableActivity, AcademicScheduleRoom, AcademicScheduleSubject } from '@free-spot/academic-schedule/domain';
import { toTimetableActivityCardVM } from './timetable-activity.vm.mapper';
describe('toTimetableActivityCardVM', () => {

  it('should map timtaeble activity to card vm model', () => {
    const activity = {
      id: '1',
      weekDay: 'MONDAY' as WeekDay,
      startHour: 1,
      endHour: 8,
      weekParity: 'ODD' as WeekParity,
      activityType: 'LABORATORY' as ActivityType,
      roomId: '1',
      subjectId: '1'
    } as unknown as TimetableActivity;

    const rooms = [{
      id: '1',
      name: 'room'
    }] as AcademicScheduleRoom[];

    const subjects = [{
      id: '1',
      shortName: 'subj'
    }] as AcademicScheduleSubject[];

    const result = toTimetableActivityCardVM(activity, rooms, subjects);

    expect(result).toEqual(
      {
        id: '1',
        weekDay: 'MONDAY',
        startHour: 1,
        endHour: 8,
        weekParity: 'ODD',
        activityType: 'LABORATORY',
        roomName: 'room',
        subjectItemShortName: 'subj'
      }
    );

  });

  it('should map missing room and subject to empty string', () => {
    const activity = {
      id: '1',
      weekDay: 'MONDAY' as WeekDay,
      startHour: 1,
      endHour: 8,
      weekParity: 'ODD' as WeekParity,
      activityType: 'LABORATORY' as ActivityType,
      roomId: '1',
      subjectId: '1'
    } as unknown as TimetableActivity;

    const result = toTimetableActivityCardVM(activity, [], []);

    expect(result).toEqual(
      {
        id: '1',
        weekDay: 'MONDAY',
        startHour: 1,
        endHour: 8,
        weekParity: 'ODD',
        activityType: 'LABORATORY',
        roomName: '',
        subjectItemShortName: ''
      }
    );
  });

  it('should use subject name when shortName is missing', () => {
    const activity = {
      id: '1',
      weekDay: 'MONDAY' as WeekDay,
      startHour: 1,
      endHour: 8,
      weekParity: 'ODD' as WeekParity,
      activityType: 'LABORATORY' as ActivityType,
      roomId: '1',
      subjectId: '1'
    } as unknown as TimetableActivity;

    const rooms = [{ id: '1', name: 'room' }] as AcademicScheduleRoom[];
    const subjects = [{ id: '1', name: 'Subject Name' }] as AcademicScheduleSubject[];

    const result = toTimetableActivityCardVM(activity, rooms, subjects);

    expect(result.subjectItemShortName).toBe('Subject Name');
  });
});
