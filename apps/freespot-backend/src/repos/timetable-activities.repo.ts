import { TimetableActivityDbDoc, TimetableActivityDbRecord } from "../db/types";
import { timetableActivityPatchToDbSet, timetableActivityToDbRecord, timetableActivityToDto } from "../mappers";
import { TimetableActivityCreateRequest, TimetableActivityResponseDto, TimetableActivityUpdateRequest } from "../schemas/timetable-activities.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const TIMETABLE_ACTIVITIES_COLLECTION = "timetable_activities";

export async function listTimetableActivities(): Promise<TimetableActivityResponseDto[]> {
  const collection = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);
  const docs = await collection.find({}).sort({ date: 1, startHour: 1 }).toArray();
  return docs.map(timetableActivityToDto);
}

export async function getTimetableActivityById(id: string): Promise<TimetableActivityResponseDto | null> {
  const collection = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? timetableActivityToDto(doc) : null;
}

export async function createTimetableActivity(input: TimetableActivityCreateRequest): Promise<TimetableActivityResponseDto> {
  const collection = await getCollection<TimetableActivityDbRecord>(TIMETABLE_ACTIVITIES_COLLECTION);
  const record = timetableActivityToDbRecord(input);
  const result = await collection.insertOne(record);
  return timetableActivityToDto({ _id: result.insertedId, ...record });
}

export async function updateTimetableActivityById(id: string, patch: TimetableActivityUpdateRequest): Promise<TimetableActivityResponseDto | null> {
  const collection = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);
  const updateSet = timetableActivityPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? timetableActivityToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? timetableActivityToDto(updated) : null;
}

export async function deleteTimetableActivityById(id: string): Promise<boolean> {
  const collection = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
