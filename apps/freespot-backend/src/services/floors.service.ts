import type { FloorCreateRequest, FloorUpdateRequest, FloorResponseDto } from "../schemas/floors.zod";
import * as repo from "../repos/floors.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getFloors(): Promise<FloorResponseDto[]> { return repo.listFloors(); }

export async function getFloor(id: string): Promise<FloorResponseDto> {
  const res = await repo.getFloorById(id);
  if (!res) throw new NotFoundError("Floor not found");
  return res;
}

export async function createFloor(input: FloorCreateRequest): Promise<FloorResponseDto> {
  try { return await repo.createFloor(input); } catch (e) { mapMongoError(e); }
}

export async function updateFloor(id: string, patch: FloorUpdateRequest): Promise<FloorResponseDto> {
  try {
    const res = await repo.updateFloorById(id, patch);
    if (!res) throw new NotFoundError("Floor not found");
    return res;
  } catch (e) { mapMongoError(e); }
}

export async function deleteFloor(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteFloorById(id);
    if (!ok) throw new NotFoundError("Floor not found");
    return ok;
  } catch (e) { mapMongoError(e); }
}
