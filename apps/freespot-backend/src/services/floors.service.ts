import type {
  FloorCreateRequest,
  FloorUpdateRequest,
  FloorResponseDto,
} from "../schemas/floors.zod";
import * as repo from "../repos/floors.repo";
import { NotFoundError } from "../errors/app-errors";
import { mapMongoError } from "../errors/mongo-error.mapper";

export async function getFloors(): Promise<FloorResponseDto[]> {
  return repo.listFloors();
}

export async function getFloor(id: string): Promise<FloorResponseDto> {
  const res = await repo.getFloorById(id);

  if (!res) {
    throw new NotFoundError("Floor not found");
  }

  return res;
}

export async function createFloor(
  input: FloorCreateRequest,
): Promise<FloorResponseDto> {
  try {
    return await repo.createFloor(input);
  } catch (error) {
    mapMongoError(error);
  }
}

export async function updateFloor(
  id: string,
  patch: FloorUpdateRequest,
): Promise<FloorResponseDto> {
  let res: FloorResponseDto | null;

  try {
    res = await repo.updateFloorById(id, patch);
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("Floor not found");
  }

  return res;
}

export async function deleteFloor(id: string): Promise<boolean> {
  let ok: boolean;

  try {
    ok = await repo.deleteFloorById(id);
  } catch (error) {
    mapMongoError(error);
  }

  if (!ok) {
    throw new NotFoundError("Floor not found");
  }

  return ok;
}
