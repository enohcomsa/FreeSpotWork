import { RoomDbDoc, RoomDbRecord } from "../db/types";
import { roomPatchToDbSet, roomToDbRecord, roomToDto } from "../mappers";
import { RoomCreateRequest, RoomResponseDto, RoomUpdateRequest } from "../schemas/rooms.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const ROOMS_COLLECTION = "rooms";

export async function listRooms(): Promise<RoomResponseDto[]> {
  const collection = await getCollection<RoomDbDoc>(ROOMS_COLLECTION);
  const docs = await collection.find({}).sort({ name: 1 }).toArray();
  return docs.map(roomToDto);
}

export async function getRoomById(id: string): Promise<RoomResponseDto | null> {
  const collection = await getCollection<RoomDbDoc>(ROOMS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? roomToDto(doc) : null;
}

export async function createRoom(input: RoomCreateRequest): Promise<RoomResponseDto> {
  const collection = await getCollection<RoomDbRecord>(ROOMS_COLLECTION);
  const record = roomToDbRecord(input);
  const result = await collection.insertOne(record);
  return roomToDto({ _id: result.insertedId, ...record });
}

export async function updateRoomById(id: string, patch: RoomUpdateRequest): Promise<RoomResponseDto | null> {
  const collection = await getCollection<RoomDbDoc>(ROOMS_COLLECTION);
  const updateSet = roomPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? roomToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? roomToDto(updated) : null;
}

export async function deleteRoomById(id: string): Promise<boolean> {
  const collection = await getCollection<RoomDbDoc>(ROOMS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
