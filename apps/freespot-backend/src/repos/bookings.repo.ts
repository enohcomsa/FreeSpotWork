import { FindOneAndUpdateOptions, ObjectId, WithId } from "mongodb";
import { connectToDatabase } from "../db";
import {
  BookingCreateInput,
  BookingUpdateInput,
  BookingResponseDto,
} from "../schemas/bookings.zod";
import { BookingStatusT, SourceTypeT } from "../schemas/common.zod";

type BookingSourceDoc = { type: SourceTypeT; id: ObjectId } | null;

interface BookingDoc {
  _id?: ObjectId;
  activityId: ObjectId;
  userId: ObjectId;
  cohortId: ObjectId | null;
  status: BookingStatusT;
  createdAt: Date;
  updatedAt: Date | null;
  source: BookingSourceDoc;
}

function mapToDto(doc: WithId<BookingDoc>): BookingResponseDto {
  return {
    id: doc._id.toHexString(),
    activityId: doc.activityId.toHexString(),
    userId: doc.userId.toHexString(),
    cohortId: doc.cohortId ? doc.cohortId.toHexString() : null,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
    source: doc.source
      ? { type: doc.source.type, id: doc.source.id.toHexString() }
      : null,
  };
}

async function getCollection() {
  const db = await connectToDatabase();
  return db.collection("bookings");
}

export async function findById(id: string): Promise<BookingResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<BookingDoc>) : null;
}

export async function insertOne(input: BookingCreateInput): Promise<BookingResponseDto> {
  const col = await getCollection();
  const now = new Date();

  const doc = {
    activityId: new ObjectId(input.activityId),
    userId: new ObjectId(input.userId),
    cohortId: input.cohortId ? new ObjectId(input.cohortId) : null,
    status: input.status,
    createdAt: now,
    updatedAt: null,
    source: input.source ? { type: input.source.type, id: new ObjectId(input.source.id) } : null,
  };

  const result = await col.insertOne(doc);
  return mapToDto({ _id: result.insertedId, ...doc });
}

export async function updateById(
  id: string,
  patch: BookingUpdateInput
): Promise<BookingResponseDto | null> {
  const col = await getCollection();

  const setPatch: Partial<Pick<BookingDoc, "activityId" | "status" | "updatedAt">> = {
    updatedAt: new Date(),
  };
  if (patch.activityId) setPatch.activityId = new ObjectId(patch.activityId);
  if (patch.status) setPatch.status = patch.status as BookingStatusT;

  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };

  const updated = await col.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: setPatch }, opts);
  return updated ? mapToDto(updated as WithId<BookingDoc>) : null;
}

export async function deleteById(id: string): Promise<boolean> {
  const col = await getCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
