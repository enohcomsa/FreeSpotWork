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

export async function getBookings(): Promise<BookingResponseDto[]> {
  return repo.listBookings();
}

export async function getBooking(id: string): Promise<BookingResponseDto> {
  const res = await repo.getBookingById(id);
  if (!res) throw new NotFoundError("Booking not found");
  return res;
}

export async function createBooking(input: BookingCreateRequest): Promise<BookingResponseDto> {
  try {
    return await repo.createBooking(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function rescheduleBooking(id: string, input: BookingRescheduleRequest): Promise<BookingResponseDto> {
  const booking = await repo.getBookingDocById(id);
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

  if (booking.activityId.toHexString() === input.activityId) {
    throw new BadRequestError("New activity must be different from current activity");
  }

  const nextActivity = await repo.getTimetableActivityDocById(input.activityId);
  if (!nextActivity) throw new BadRequestError("Target activity not found");

  if (nextActivity.activityType === "SPECIAL_EVENT") {
    throw new BadRequestError("Cannot reschedule to SPECIAL_EVENT");
  }

  if (nextActivity.subjectId.toHexString() !== booking.subjectId.toHexString()) {
    throw new BadRequestError("Target activity must have same subjectId");
  }

  if (nextActivity.activityType !== booking.activityType) {
    throw new BadRequestError("Target activity must have same activityType");
  }

  const nextCohortIds = new Set(nextActivity.cohortIds.map((x) => x.toHexString()));
  const matchesProgramYear =
    (booking.groupCohortId && nextCohortIds.has(booking.groupCohortId.toHexString())) ||
    (booking.semigroupCohortId && nextCohortIds.has(booking.semigroupCohortId.toHexString()));

  if (!matchesProgramYear && !booking.programYearId) {
    throw new BadRequestError("Target activity is not compatible");
  }

  if (booking.status !== "CONFIRMED" && booking.status !== "WAITLISTED") {
    throw new BadRequestError("Only active bookings can be rescheduled");
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

  if (!updated) throw new NotFoundError("Booking not found");

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

export async function deleteBooking(id: string): Promise<boolean> {
  try {
    const booking = await repo.getBookingDocById(id);
    if (!booking) throw new NotFoundError("Booking not found");

    if (booking.activityType !== "SPECIAL_EVENT") {
      throw new BadRequestError("Only SPECIAL_EVENT bookings can be deleted");
    }

    const ok = await repo.deleteBookingById(id);
    if (!ok) throw new NotFoundError("Booking not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
