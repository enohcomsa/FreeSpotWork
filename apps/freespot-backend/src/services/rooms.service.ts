import type { RoomCreateRequest, RoomUpdateRequest, RoomResponseDto } from "../schemas/rooms.zod";
import * as repo from "../repos/rooms.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getRooms(): Promise<RoomResponseDto[]> { return repo.listRooms(); }

export async function getRoom(id: string): Promise<RoomResponseDto> {
  const res = await repo.getRoomById(id);
  if (!res) throw new NotFoundError("Room not found");
  return res;
}

export async function createRoom(input: RoomCreateRequest): Promise<RoomResponseDto> {
  try { return await repo.createRoom(input); } catch (e) { mapMongoError(e); }
}

export async function updateRoom(id: string, patch: RoomUpdateRequest): Promise<RoomResponseDto> {
  try {
    const res = await repo.updateRoomById(id, patch);
    if (!res) throw new NotFoundError("Room not found");
    return res;
  } catch (e) { mapMongoError(e); }
}

export async function deleteRoom(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteRoomById(id);
    if (!ok) throw new NotFoundError("Room not found");
    return ok;
  } catch (e) { mapMongoError(e); }
}
