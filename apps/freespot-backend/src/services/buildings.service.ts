import type {
  BuildingCreateRequest,
  BuildingUpdateRequest,
  BuildingResponseDto,
} from "../schemas/buildings.zod";
import * as repo from "../repos/buildings.repo";
import { NotFoundError } from "../errors/app-errors";
import { mapMongoError } from "../errors/mongo-error.mapper";

export async function getBuildings(): Promise<BuildingResponseDto[]> {
  return repo.listBuildings();
}

export async function getBuilding(id: string): Promise<BuildingResponseDto> {
  const res = await repo.getBuildingById(id);

  if (!res) {
    throw new NotFoundError("Building not found");
  }

  return res;
}

export async function createBuilding(
  input: BuildingCreateRequest,
): Promise<BuildingResponseDto> {
  try {
    return await repo.createBuilding(input);
  } catch (error) {
    mapMongoError(error);
  }
}

export async function updateBuilding(
  id: string,
  patch: BuildingUpdateRequest,
): Promise<BuildingResponseDto> {
  let res: BuildingResponseDto | null;

  try {
    res = await repo.updateBuildingById(id, patch);
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("Building not found");
  }

  return res;
}

export async function deleteBuilding(id: string): Promise<boolean> {
  let ok: boolean;

  try {
    ok = await repo.deleteBuildingById(id);
  } catch (error) {
    mapMongoError(error);
  }

  if (!ok) {
    throw new NotFoundError("Building not found");
  }

  return ok;
}
