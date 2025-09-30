import type { FloorCreateInput, FloorUpdateInput, FloorResponseDto } from "../schemas/floors.zod";
import * as repo from "../repos/floors.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getFloor(id: string): Promise<FloorResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("Floor not found");
  return res;
}

export async function createFloor(input: FloorCreateInput): Promise<FloorResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateFloor(id: string, patch: FloorUpdateInput): Promise<FloorResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("Floor not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteFloor(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("Floor not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
