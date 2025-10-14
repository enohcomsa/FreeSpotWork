import type {
  BuildingCreateRequest,
  BuildingUpdateRequest,
  BuildingResponseDto,
} from "../schemas/buildings.zod";
import * as repo from "../repos/buildings.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getBuildings(): Promise<BuildingResponseDto[]> {
  return repo.listBuildings();
}

export async function getBuilding(id: string): Promise<BuildingResponseDto> {
  const res = await repo.getBuildingById(id);
  if (!res) throw new NotFoundError("BuildingLegacy not found");
  return res;
}

export async function createBuilding(input: BuildingCreateRequest): Promise<BuildingResponseDto> {
  try {
    return await repo.createBuilding(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateBuilding(id: string, patch: BuildingUpdateRequest): Promise<BuildingResponseDto> {
  try {
    const res = await repo.updateBuildingById(id, patch);
    if (!res) throw new NotFoundError("BuildingLegacy not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteBuilding(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteBuildingById(id);
    if (!ok) throw new NotFoundError("BuildingLegacy not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
