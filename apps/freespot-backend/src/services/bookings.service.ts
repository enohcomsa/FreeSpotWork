import type {
  BookingCreateRequest,
  BookingRescheduleRequest,
  BookingUpdateRequest,
  BookingResponseDto,
} from "../schemas/bookings.zod";
import * as repo from "../repos/bookings.repo";
import { BadRequestError, NotFoundError } from "../errors/app-errors";
import { mapMongoError } from "../errors/mongo-error.mapper";
import { toObjectId } from "../utils/mongo";

function toBookingResponseDto(
  booking: Awaited<ReturnType<typeof repo.getBookingDocByIdForUser>> extends infer T
    ? Exclude<T, null>
    : never,
): BookingResponseDto {
  return {
    id: booking._id.toHexString(),
    activityId: booking.activityId.toHexString(),
    userId: booking.userId.toHexString(),
    facultyId: booking.facultyId == null ? null : booking.facultyId.toHexString(),
    programId: booking.programId == null ? null : booking.programId.toHexString(),
    programYearId: booking.programYearId == null ? null : booking.programYearId.toHexString(),
    groupCohortId: booking.groupCohortId == null ? null : booking.groupCohortId.toHexString(),
    semigroupCohortId:
      booking.semigroupCohortId == null ? null : booking.semigroupCohortId.toHexString(),
    subjectId: booking.subjectId == null ? null : booking.subjectId.toHexString(),
    activityType: booking.activityType,
    status: booking.status,
    originalActivityId:
      booking.originalActivityId == null ? null : booking.originalActivityId.toHexString(),
    isRescheduled: booking.isRescheduled ?? null,
    rescheduledAt: booking.rescheduledAt == null ? null : booking.rescheduledAt.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt == null ? null : booking.updatedAt.toISOString(),
  };
}

export async function getMyBookings(userId: string): Promise<BookingResponseDto[]> {
  return repo.listBookingsByUserId(userId);
}

export async function getBookingsByUserIdForAdmin(userId: string): Promise<BookingResponseDto[]> {
  return repo.listBookingsByUserId(userId);
}

export async function getMyBooking(id: string, userId: string): Promise<BookingResponseDto> {
  const res = await repo.getBookingByIdForUser(id, userId);

  if (!res) {
    throw new NotFoundError("Booking not found");
  }

  return res;
}

export async function createBooking(
  userId: string,
  input: BookingCreateRequest,
): Promise<BookingResponseDto> {
  const event = await repo.getEventDocById(input.activityId);
  if (!event) {
    throw new BadRequestError("Special event not found");
  }

  const userBookings = await repo.findUserBookingDocsByUserId(userId);
  const duplicate = userBookings.find(
    booking =>
      booking.activityType === "SPECIAL_EVENT" &&
      booking.activityId.toHexString() === input.activityId,
  );

  if (duplicate) {
    throw new BadRequestError("Special event already booked");
  }

  await repo.incrementReservedSpotsForEvent(input.activityId);

  try {
    const created = await repo.createBookingFromRecord({
      activityId: event._id,
      userId: toObjectId(userId),
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

    return toBookingResponseDto(created);
  } catch (error) {
    mapMongoError(error);
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
  b: { date: string; startHour: number; endHour: number },
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
  input: BookingRescheduleRequest,
): Promise<BookingResponseDto> {
  const booking = await repo.getBookingDocByIdForUser(id, userId);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

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

  const currentActivity = await repo.getTimetableActivityDocById(
    booking.activityId.toHexString(),
  );
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

  const userBookings = await repo.findUserBookingDocsByUserId(
    booking.userId.toHexString(),
  );

  const otherBookings = userBookings.filter(
    otherBooking => otherBooking._id.toHexString() !== booking._id.toHexString(),
  );

  const otherActivityIds = [...new Set(otherBookings.map(b => b.activityId.toHexString()))];

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

  let updated: Awaited<ReturnType<typeof repo.updateBookingDocById>> | null = null;

  try {
    updated = await repo.updateBookingDocById(id, {
      activityId: nextActivity._id,
      subjectId: nextActivity.subjectId,
      activityType: nextActivity.activityType,
      status: nextStatus,
      originalActivityId: booking.originalActivityId ?? booking.activityId,
      isRescheduled: true,
      rescheduledAt: new Date(),
    });
  } catch (error) {
    mapMongoError(error);
  }

  if (!updated) {
    throw new NotFoundError("Booking not found");
  }

  return toBookingResponseDto(updated);
}

export async function updateBooking(
  id: string,
  patch: BookingUpdateRequest,
): Promise<BookingResponseDto> {
  let res: BookingResponseDto | null = null;

  try {
    res = await repo.updateBookingById(id, patch);
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("Booking not found");
  }

  return res;
}

export async function deleteMyBooking(id: string, userId: string): Promise<boolean> {
  const booking = await repo.getBookingDocByIdForUser(id, userId);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.activityType !== "SPECIAL_EVENT") {
    throw new BadRequestError("Only SPECIAL_EVENT bookings can be deleted");
  }

  await repo.decrementReservedSpotsForEvent(booking.activityId.toHexString());

  let ok = false;

  try {
    ok = await repo.deleteBookingById(id);
  } catch (error) {
    mapMongoError(error);
  }

  if (!ok) {
    throw new NotFoundError("Booking not found");
  }

  return ok;
}
