import { describe, it, expect } from "vitest";
import { mapToActivityBookingVm } from './activity-booking.vm.mapper';
import type { ActivityBooking, ActivityBookingActivity, ActivityBookingSubject, ActivityBookingRoom, ActivityBookingBuilding, ActivityBookingFloor } from '@free-spot/activity-bookings/domain';
import type { ActivityType } from "@free-spot/shared/domain";

describe('mapToActivityBookingVm', () => {
  it('should map booking to booking vm model', () => {
    const booking = {
      id: '1',
      activityType: 'LABORATORY' as ActivityType,
    } as ActivityBooking;

    const activity = {
      date: '01.01.2021',
      startHour: 1,
      endHour: 2,
    } as ActivityBookingActivity;

    const subject = {
      shortName: 'shortName',
    } as ActivityBookingSubject;

    const room = {
      name: 'room'
    } as ActivityBookingRoom;

    const building = {
      name: 'build'
    } as ActivityBookingBuilding;

    const floor = {
      name: 'fl'
    } as ActivityBookingFloor;

    const result = mapToActivityBookingVm(booking, activity, subject, room, building, floor);

    expect(result).toEqual({
      id: '1',
      activityType: 'LABORATORY',
      subjectName: 'shortName',
      buildingName: 'build',
      floorName: 'fl',
      roomName: 'room',
      date: '01.01.2021',
      startHour: 1,
      endHour: 2,
    });
  });

  it('should use subject name when shortName is missing', () => {
    const booking = {
      id: '1',
      activityType: 'LABORATORY' as ActivityType,
    } as ActivityBooking;

    const activity = {
      date: '01.01.2021',
      startHour: 1,
      endHour: 2,
    } as ActivityBookingActivity;

    const subject = {
      name: 'Subject Name',
      shortName: null,
    } as unknown as ActivityBookingSubject;

    const room = {
      name: 'room',
    } as ActivityBookingRoom;

    const building = {
      name: 'build',
    } as ActivityBookingBuilding;

    const floor = {
      name: 'fl',
    } as ActivityBookingFloor;

    const result = mapToActivityBookingVm(booking, activity, subject, room, building, floor);

    expect(result.subjectName).toBe('Subject Name');
  });
})
