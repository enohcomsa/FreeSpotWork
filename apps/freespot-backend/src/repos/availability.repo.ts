import { BookingDbDoc, TimetableActivityDbDoc } from "../db/types";
import { getCollection, toObjectId } from "../utils/mongo";
import { RescheduleOptionDto, RescheduleOptionsResponseDto } from "../schemas/availability.zod";
import { todayIsoDateUtc } from "../utils/dates";

const BOOKINGS_COLLECTION = "bookings";
const TIMETABLE_ACTIVITIES_COLLECTION = "timetable_activities";

export async function findRescheduleOptions(bookingId: string): Promise<RescheduleOptionsResponseDto | null> {
  const bookings = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  const activities = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);

  const booking = await bookings.findOne({ _id: toObjectId(bookingId) });
  if (!booking) return null;

  const currentBooking = {
    id: booking._id.toHexString(),
    activityId: booking.activityId.toHexString(),
    subjectId: booking.subjectId == null ? null : booking.subjectId.toHexString(),
    activityType: booking.activityType,
    programYearId: booking.programYearId == null ? null : booking.programYearId.toHexString(),
    groupCohortId: booking.groupCohortId == null ? null : booking.groupCohortId.toHexString(),
    semigroupCohortId: booking.semigroupCohortId == null ? null : booking.semigroupCohortId.toHexString(),
    originalActivityId: booking.originalActivityId == null ? null : booking.originalActivityId.toHexString(),
    isRescheduled: booking.isRescheduled ?? null,
    rescheduledAt: booking.rescheduledAt == null ? null : booking.rescheduledAt.toISOString(),
  };

  if (!booking.subjectId || !booking.programYearId || !booking.groupCohortId || !booking.semigroupCohortId || booking.activityType === "SPECIAL_EVENT") {
    return {
      currentBooking,
      items: [],
      total: 0,
    };
  }

  const docs = await activities
    .find({
      _id: { $ne: booking.activityId },
      date: { $gte: todayIsoDateUtc() },
      subjectId: booking.subjectId,
      activityType: booking.activityType,
      freeSpots: { $gt: 0 },
    })
    .sort({ date: 1, startHour: 1 })
    .toArray();

  const items: RescheduleOptionDto[] = docs.map((a) => ({
    activityId: a._id.toHexString(),
    subjectId: a.subjectId.toHexString(),
    activityType: a.activityType,
    date: a.date,
    weekDay: a.weekDay,
    startHour: a.startHour,
    endHour: a.endHour,
    capacity: a.capacity,
    reservedSpots: a.reservedSpots,
    busySpots: a.busySpots,
    freeSpots: a.freeSpots,
    cohortIds: a.cohortIds.map((x) => x.toHexString()),
  }));

  return {
    currentBooking,
    items,
    total: items.length,
  };
}
