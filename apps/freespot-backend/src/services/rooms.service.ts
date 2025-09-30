import type { RoomCreateInput, RoomUpdateInput, RoomResponseDto } from "../schemas/rooms.zod";
import * as repo from "../repos/rooms.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getRoom(id: string): Promise<RoomResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("Room not found");
  return res;
}

export async function createRoom(input: RoomCreateInput): Promise<RoomResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateRoom(id: string, patch: RoomUpdateInput): Promise<RoomResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("Room not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteRoom(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("Room not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
