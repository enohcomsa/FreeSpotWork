import { EventCreateRequest, EventUpdateRequest, EventResponseDto } from "../schemas/events.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";
import { EventDbDoc, EventDbRecord } from "../db/types/events.db";
import { eventToDbRecord, eventToDto, eventPatchToDbSet } from "../mappers/events.mapper";

const EVENTS_COLLECTION = "events";

export async function listEvents(): Promise<EventResponseDto[]> {
  const collection = await getCollection<EventDbDoc>(EVENTS_COLLECTION);
  const docs = await collection.find({}).sort({ date: 1, startHour: 1, name: 1 }).toArray();
  return docs.map(eventToDto);
}

export async function getEventById(id: string): Promise<EventResponseDto | null> {
  const collection = await getCollection<EventDbDoc>(EVENTS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? eventToDto(doc) : null;
}

export async function createEvent(input: EventCreateRequest): Promise<EventResponseDto> {
  const collection = await getCollection<EventDbRecord>(EVENTS_COLLECTION);
  const record = eventToDbRecord(input);

  const result = await collection.insertOne(record);
  return eventToDto({ _id: result.insertedId, ...record });
}

export async function updateEventById(id: string, patch: EventUpdateRequest): Promise<EventResponseDto | null> {
  const collection = await getCollection<EventDbDoc>(EVENTS_COLLECTION);
  const updateSet = eventPatchToDbSet(patch);

  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? eventToDto(current) : null;
  }

  const updated = await collection.findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: updateSet },
    { returnDocument: "after" }
  );

  return updated ? eventToDto(updated) : null;
}

export async function deleteEventById(id: string): Promise<boolean> {
  const collection = await getCollection<EventDbDoc>(EVENTS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
