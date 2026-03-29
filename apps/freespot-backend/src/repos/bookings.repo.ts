import { BookingUpdateRequest, BookingResponseDto } from "../schemas/bookings.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";
import { BookingDbDoc, BookingDbRecord, TimetableActivityDbDoc, EventDbDoc } from "../db/types";
import { bookingToDto, bookingPatchToDbSet } from "../mappers";
import { ObjectId } from "mongodb";

const BOOKINGS_COLLECTION = "bookings";
const TIMETABLE_ACTIVITIES_COLLECTION = "timetable_activities";
const EVENTS_COLLECTION = "events";

export async function listBookingsByUserId(userId: string): Promise<BookingResponseDto[]> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  const docs = await collection
    .find({ userId: toObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map(bookingToDto);
}

export async function listBookingDocsByUserId(userId: string): Promise<BookingDbDoc[]> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  return collection
    .find({ userId: toObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getBookingById(id: string): Promise<BookingResponseDto | null> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? bookingToDto(doc) : null;
}

export async function getBookingByIdForUser(id: string, userId: string): Promise<BookingResponseDto | null> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  const doc = await collection.findOne({
    _id: toObjectId(id),
    userId: toObjectId(userId),
  });

  return doc ? bookingToDto(doc) : null;
}

export async function getBookingDocById(id: string): Promise<BookingDbDoc | null> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  return collection.findOne({ _id: toObjectId(id) });
}

export async function getBookingDocByIdForUser(id: string, userId: string): Promise<BookingDbDoc | null> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  return collection.findOne({
    _id: toObjectId(id),
    userId: toObjectId(userId),
  });
}

export async function createBookingFromRecord(record: BookingDbRecord): Promise<BookingDbDoc> {
  const collection = await getCollection<BookingDbRecord>(BOOKINGS_COLLECTION);
  const result = await collection.insertOne(record);
  return { _id: result.insertedId, ...record };
}

export async function updateBookingById(id: string, patch: BookingUpdateRequest): Promise<BookingResponseDto | null> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  const updateSet = bookingPatchToDbSet(patch);

  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? bookingToDto(current) : null;
  }

  const updated = await collection.findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: updateSet },
    { returnDocument: "after" }
  );

  return updated ? bookingToDto(updated) : null;
}

export async function updateBookingDocById(id: string, set: Partial<BookingDbRecord>): Promise<BookingDbDoc | null> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);

  const updated = await collection.findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: { ...set, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  return updated ?? null;
}

export async function deleteBookingById(id: string): Promise<boolean> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}

export async function deleteFutureNormalBookingsForUser(userId: string): Promise<number> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);

  const { deletedCount } = await collection.deleteMany({
    userId: toObjectId(userId),
    activityType: { $ne: "SPECIAL_EVENT" },
  });

  return deletedCount ?? 0;
}

export async function getTimetableActivityDocById(id: string): Promise<TimetableActivityDbDoc | null> {
  const collection = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);
  return collection.findOne({ _id: toObjectId(id) });
}

export async function getTimetableActivityDocsByIds(ids: string[]): Promise<TimetableActivityDbDoc[]> {
  const collection = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);
  const objectIds: ObjectId[] = ids.map(toObjectId);

  return collection.find({ _id: { $in: objectIds } }).toArray();
}

export async function getEventDocById(id: string): Promise<EventDbDoc | null> {
  const collection = await getCollection<EventDbDoc>(EVENTS_COLLECTION);
  return collection.findOne({ _id: toObjectId(id) });
}

export async function incrementReservedSpotsForEvent(eventId: string): Promise<void> {
  const collection = await getCollection<EventDbDoc>(EVENTS_COLLECTION);

  await collection.updateOne(
    { _id: toObjectId(eventId) },
    {
      $inc: {
        reservedSpots: 1,
      },
    }
  );
}

export async function decrementReservedSpotsForEvent(eventId: string): Promise<void> {
  const collection = await getCollection<EventDbDoc>(EVENTS_COLLECTION);

  await collection.updateOne(
    { _id: toObjectId(eventId) },
    {
      $inc: {
        reservedSpots: -1,
      },
    }
  );
}

export async function reserveSpotForActivity(activityId: string): Promise<"CONFIRMED" | "WAITLISTED"> {
  const collection = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);

  const confirmed = await collection.findOneAndUpdate(
    {
      _id: toObjectId(activityId),
      freeSpots: { $gt: 0 },
    },
    {
      $inc: {
        freeSpots: -1,
        busySpots: 1,
      },
    },
    { returnDocument: "after" }
  );

  if (confirmed) {
    return "CONFIRMED";
  }

  await collection.updateOne(
    { _id: toObjectId(activityId) },
    {
      $inc: {
        reservedSpots: 1,
      },
    }
  );

  return "WAITLISTED";
}

export async function releaseSpotForActivity(activityId: string, bookingStatus: "CONFIRMED" | "WAITLISTED"): Promise<void> {
  const collection = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);

  if (bookingStatus === "CONFIRMED") {
    await collection.updateOne(
      { _id: toObjectId(activityId) },
      {
        $inc: {
          freeSpots: 1,
          busySpots: -1,
        },
      }
    );
    return;
  }

  await collection.updateOne(
    { _id: toObjectId(activityId) },
    {
      $inc: {
        reservedSpots: -1,
      },
    }
  );
}

export async function findUserBookingDocsByUserId(userId: string): Promise<BookingDbDoc[]> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);

  return collection
    .find({
      userId: toObjectId(userId),
      status: { $in: ["CONFIRMED", "WAITLISTED"] },
    })
    .toArray();
}
