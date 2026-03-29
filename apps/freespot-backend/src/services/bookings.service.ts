import type { BookingCreateRequest, BookingRescheduleRequest, BookingUpdateRequest, BookingResponseDto } from "../schemas/bookings.zod";
import * as repo from "../repos/bookings.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

class BadRequestError extends Error {
  status = 400;
  code = "BAD_REQUEST";

  constructor(message: string) {
    super(message);
  }
}

export async function getMyBookings(userId: string): Promise<BookingResponseDto[]> {
  return repo.listBookingsByUserId(userId);
}

export async function getBookingsByUserIdForAdmin(userId: string): Promise<BookingResponseDto[]> {
  return repo.listBookingsByUserId(userId);
}

export async function getMyBooking(id: string, userId: string): Promise<BookingResponseDto> {
  const res = await repo.getBookingByIdForUser(id, userId);
  if (!res) throw new NotFoundError("Booking not found");
  return res;
}

export async function createBooking(userId: string, input: BookingCreateRequest): Promise<BookingResponseDto> {
  try {
    const event = await repo.getEventDocById(input.activityId);
    if (!event) {
      throw new BadRequestError("Special event not found");
    }

    const userBookings = await repo.findUserBookingDocsByUserId(userId);
    const duplicate = userBookings.find(
      (booking) =>
        booking.activityType === "SPECIAL_EVENT" &&
        booking.activityId.toHexString() === input.activityId
    );

    if (duplicate) {
      throw new BadRequestError("Special event already booked");
    }

    await repo.incrementReservedSpotsForEvent(input.activityId);

    const created = await repo.createBookingFromRecord({
      activityId: event._id,
      userId: repo["toObjectId"] ? repo["toObjectId"](userId) : undefined as never,
      facultyId: null,
      programId: null,
      programYearId: null,
      groupCohortId: null,
      semigroupCohortId: null,
      subjectId: null,
      activityType: "SPECIAL_EVENT",
      status: "CONFIRMED",
      originalActivityId: null,
      isRescheduled: false,
      rescheduledAt: null,
      createdAt: new Date(),
      updatedAt: null,
    });

    return {
      id: created._id.toHexString(),
      activityId: created.activityId.toHexString(),
      userId: created.userId.toHexString(),
      facultyId: created.facultyId == null ? null : created.facultyId.toHexString(),
      programId: created.programId == null ? null : created.programId.toHexString(),
      programYearId: created.programYearId == null ? null : created.programYearId.toHexString(),
      groupCohortId: created.groupCohortId == null ? null : created.groupCohortId.toHexString(),
      semigroupCohortId: created.semigroupCohortId == null ? null : created.semigroupCohortId.toHexString(),
      subjectId: created.subjectId == null ? null : created.subjectId.toHexString(),
      activityType: created.activityType,
      status: created.status,
      originalActivityId: created.originalActivityId == null ? null : created.originalActivityId.toHexString(),
      isRescheduled: created.isRescheduled ?? null,
      rescheduledAt: created.rescheduledAt == null ? null : created.rescheduledAt.toISOString(),
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt == null ? null : created.updatedAt.toISOString(),
    };
  } catch (e) {
    mapMongoError(e);
  }
}

function getActivityStartMs(activity: { date: string; startHour: number }): number {
  const base = new Date(activity.date);
  const start = new Date(base);
  start.setUTCHours(activity.startHour, 0, 0, 0);
  return start.getTime();
}

function getActivityEndMs(activity: { date: string; endHour: number }): number {
  const base = new Date(activity.date);
  const end = new Date(base);
  end.setUTCHours(activity.endHour, 0, 0, 0);
  return end.getTime();
}

function activitiesOverlap(
  a: { date: string; startHour: number; endHour: number },
  b: { date: string; startHour: number; endHour: number }
): boolean {
  const aStart = getActivityStartMs(a);
  const aEnd = getActivityEndMs(a);
  const bStart = getActivityStartMs(b);
  const bEnd = getActivityEndMs(b);

  return aStart < bEnd && bStart < aEnd;
}

export async function rescheduleMyBooking(
  id: string,
  userId: string,
  input: BookingRescheduleRequest
): Promise<BookingResponseDto> {
  const booking = await repo.getBookingDocByIdForUser(id, userId);
  if (!booking) throw new NotFoundError("Booking not found");

  if (booking.activityType === "SPECIAL_EVENT") {
    throw new BadRequestError("SPECIAL_EVENT bookings cannot be rescheduled");
  }

  if (!booking.subjectId) {
    throw new BadRequestError("Booking subjectId is required for reschedule");
  }

  if (!booking.programYearId) {
    throw new BadRequestError("Booking programYearId is required for reschedule");
  }

  if (booking.status !== "CONFIRMED" && booking.status !== "WAITLISTED") {
    throw new BadRequestError("Only active bookings can be rescheduled");
  }

  if (booking.activityId.toHexString() === input.activityId) {
    throw new BadRequestError("New activity must be different from current activity");
  }

  const currentActivity = await repo.getTimetableActivityDocById(booking.activityId.toHexString());
  if (!currentActivity) {
    throw new BadRequestError("Current activity not found");
  }

  const nextActivity = await repo.getTimetableActivityDocById(input.activityId);
  if (!nextActivity) {
    throw new BadRequestError("Target activity not found");
  }

  if (nextActivity.activityType === "SPECIAL_EVENT") {
    throw new BadRequestError("Cannot reschedule to SPECIAL_EVENT");
  }

  if (nextActivity.subjectId.toHexString() !== booking.subjectId.toHexString()) {
    throw new BadRequestError("Target activity must have same subjectId");
  }

  if (nextActivity.activityType !== booking.activityType) {
    throw new BadRequestError("Target activity must have same activityType");
  }

  const userBookings = await repo.findUserBookingDocsByUserId(booking.userId.toHexString());

  const otherBookings = userBookings.filter(
    (otherBooking) => otherBooking._id.toHexString() !== booking._id.toHexString()
  );

  const otherActivityIds = [...new Set(otherBookings.map((b) => b.activityId.toHexString()))];

  if (otherActivityIds.length > 0) {
    const otherActivities = await repo.getTimetableActivityDocsByIds(otherActivityIds);

    for (const otherActivity of otherActivities) {
      if (activitiesOverlap(nextActivity, otherActivity)) {
        throw new BadRequestError("Target activity overlaps with another booking");
      }
    }
  }

  const nextStatus = await repo.reserveSpotForActivity(input.activityId);
  await repo.releaseSpotForActivity(booking.activityId.toHexString(), booking.status);

  const updated = await repo.updateBookingDocById(id, {
    activityId: nextActivity._id,
    subjectId: nextActivity.subjectId,
    activityType: nextActivity.activityType,
    status: nextStatus,
    originalActivityId: booking.originalActivityId ?? booking.activityId,
    isRescheduled: true,
    rescheduledAt: new Date(),
  });

  if (!updated) {
    throw new NotFoundError("Booking not found");
  }

  return {
    id: updated._id.toHexString(),
    activityId: updated.activityId.toHexString(),
    userId: updated.userId.toHexString(),
    facultyId: updated.facultyId == null ? null : updated.facultyId.toHexString(),
    programId: updated.programId == null ? null : updated.programId.toHexString(),
    programYearId: updated.programYearId == null ? null : updated.programYearId.toHexString(),
    groupCohortId: updated.groupCohortId == null ? null : updated.groupCohortId.toHexString(),
    semigroupCohortId: updated.semigroupCohortId == null ? null : updated.semigroupCohortId.toHexString(),
    subjectId: updated.subjectId == null ? null : updated.subjectId.toHexString(),
    activityType: updated.activityType,
    status: updated.status,
    originalActivityId: updated.originalActivityId == null ? null : updated.originalActivityId.toHexString(),
    isRescheduled: updated.isRescheduled ?? null,
    rescheduledAt: updated.rescheduledAt == null ? null : updated.rescheduledAt.toISOString(),
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt == null ? null : updated.updatedAt.toISOString(),
  };
}

export async function updateBooking(id: string, patch: BookingUpdateRequest): Promise<BookingResponseDto> {
  try {
    const res = await repo.updateBookingById(id, patch);
    if (!res) throw new NotFoundError("Booking not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteMyBooking(id: string, userId: string): Promise<boolean> {
  try {
    const booking = await repo.getBookingDocByIdForUser(id, userId);
    if (!booking) throw new NotFoundError("Booking not found");

    if (booking.activityType !== "SPECIAL_EVENT") {
      throw new BadRequestError("Only SPECIAL_EVENT bookings can be deleted");
    }

    await repo.decrementReservedSpotsForEvent(booking.activityId.toHexString());

    const ok = await repo.deleteBookingById(id);
    if (!ok) throw new NotFoundError("Booking not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
