import type { BuildingCreateInput, BuildingUpdateInput, BuildingResponseDto } from "../schemas/buildings.zod";
import * as repo from "../repos/buildings.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getBuilding(id: string): Promise<BuildingResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("Building not found");
  return res;
}

export async function createBuilding(input: BuildingCreateInput): Promise<BuildingResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateBuilding(id: string, patch: BuildingUpdateInput): Promise<BuildingResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("Building not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteBuilding(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("Building not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
