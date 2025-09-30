import { ObjectId, WithId, Collection, FindOneAndUpdateOptions } from "mongodb";
import { connectToDatabase } from "../db";
import {
  TimetableActivityCreateInput,
  TimetableActivityUpdateInput,
  TimetableActivityResponseDto,
} from "../schemas/timetable-activities.zod";
import { ActivityType, WeekDay, WeekParity } from "../schemas/common.zod";
import { z } from "zod";

type ActivityTypeT = z.infer<typeof ActivityType>;
type WeekDayT = z.infer<typeof WeekDay>;
type WeekParityT = z.infer<typeof WeekParity>;

interface TimetableActivityDoc {
  _id?: ObjectId;
  roomId: ObjectId;
  subjectId: ObjectId;
  date: string;
  weekDay: WeekDayT;
  activityType: ActivityTypeT;
  cohortIds: ObjectId[];
  startHour: number;
  endHour: number;
  weekParity: WeekParityT;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
}

async function getCollection(): Promise<Collection<TimetableActivityDoc>> {
  const db = await connectToDatabase();
  return db.collection<TimetableActivityDoc>("timetable_activities");
}

function mapToDto(doc: WithId<TimetableActivityDoc>): TimetableActivityResponseDto {
  return {
    id: doc._id.toHexString(),
    roomId: doc.roomId.toHexString(),
    subjectId: doc.subjectId.toHexString(),
    date: doc.date,
    weekDay: doc.weekDay,
    activityType: doc.activityType,
    cohortIds: doc.cohortIds.map((id) => id.toHexString()),
    startHour: doc.startHour,
    endHour: doc.endHour,
    weekParity: doc.weekParity,
    capacity: doc.capacity,
    reservedSpots: doc.reservedSpots,
    busySpots: doc.busySpots,
    freeSpots: doc.freeSpots,
  };
}

export async function findById(id: string): Promise<TimetableActivityResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<TimetableActivityDoc>) : null;
}

export async function insertOne(
  input: TimetableActivityCreateInput
): Promise<TimetableActivityResponseDto> {
  const col = await getCollection();
  const doc: TimetableActivityDoc = {
    roomId: new ObjectId(input.roomId),
    subjectId: new ObjectId(input.subjectId),
    date: input.date,
    weekDay: input.weekDay as WeekDayT,
    activityType: input.activityType as ActivityTypeT,
    cohortIds: input.cohortIds.map((id) => new ObjectId(id)),
    startHour: input.startHour,
    endHour: input.endHour,
    weekParity: input.weekParity as WeekParityT,
    capacity: input.capacity,
    reservedSpots: input.reservedSpots,
    busySpots: input.busySpots,
    freeSpots: input.freeSpots,
  };
  const result = await col.insertOne(doc);
  const withId: WithId<TimetableActivityDoc> = { _id: result.insertedId, ...doc };
  return mapToDto(withId);
}

export async function updateById(
  id: string,
  patch: TimetableActivityUpdateInput
): Promise<TimetableActivityResponseDto | null> {
  const col = await getCollection();
  const setPatch: Partial<TimetableActivityDoc> = {};
  if (patch.roomId) setPatch.roomId = new ObjectId(patch.roomId);
  if (patch.subjectId) setPatch.subjectId = new ObjectId(patch.subjectId);
  if (patch.date) setPatch.date = patch.date;
  if (patch.weekDay) setPatch.weekDay = patch.weekDay as WeekDayT;
  if (patch.activityType) setPatch.activityType = patch.activityType as ActivityTypeT;
  if (patch.cohortIds) setPatch.cohortIds = patch.cohortIds.map((id) => new ObjectId(id));
  if (patch.startHour !== undefined) setPatch.startHour = patch.startHour;
  if (patch.endHour !== undefined) setPatch.endHour = patch.endHour;
  if (patch.weekParity) setPatch.weekParity = patch.weekParity as WeekParityT;
  if (patch.capacity !== undefined) setPatch.capacity = patch.capacity;
  if (patch.reservedSpots !== undefined) setPatch.reservedSpots = patch.reservedSpots;
  if (patch.busySpots !== undefined) setPatch.busySpots = patch.busySpots;
  if (patch.freeSpots !== undefined) setPatch.freeSpots = patch.freeSpots;
  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };
  const updated: WithId<TimetableActivityDoc> | null = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: setPatch },
    opts
  );
  return updated ? mapToDto(updated) : null;
}

export async function deleteById(id: string): Promise<boolean> {
  const col = await getCollection();
  const { deletedCount } = await col.deleteOne({ _id: new ObjectId(id) });
  return deletedCount === 1;
}
