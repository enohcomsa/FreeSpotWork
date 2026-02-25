import { BookingCreateRequest, BookingUpdateRequest, BookingResponseDto } from "../schemas/bookings.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";
import { BookingDbDoc, BookingDbRecord } from "../db/types";
import { bookingToDbRecord, bookingToDto, bookingPatchToDbSet } from "../mappers";

const BOOKINGS_COLLECTION = "bookings";

export async function listBookings(): Promise<BookingResponseDto[]> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  const docs = await collection.find({}).sort({ name: 1 }).toArray();
  return docs.map(bookingToDto);
}

export async function getBookingById(id: string): Promise<BookingResponseDto | null> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? bookingToDto(doc) : null;
}

export async function createBooking(input: BookingCreateRequest): Promise<BookingResponseDto> {
  const collection = await getCollection<BookingDbRecord>(BOOKINGS_COLLECTION);
  const record = bookingToDbRecord(input);
  const result = await collection.insertOne(record);
  return bookingToDto({ _id: result.insertedId, ...record });
}

export async function updateBookingById(id: string, patch: BookingUpdateRequest): Promise<BookingResponseDto | null> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  const updateSet = bookingPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? bookingToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? bookingToDto(updated) : null;
}

export async function deleteBookingById(id: string): Promise<boolean> {
  const collection = await getCollection<BookingDbDoc>(BOOKINGS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
