import type {
  TimetableActivityCreateInput,
  TimetableActivityUpdateInput,
  TimetableActivityResponseDto,
} from "../schemas/timetable-activities.zod";
import * as repo from "../repos/timetable-activities.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getTimetableActivity(id: string): Promise<TimetableActivityResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("Timetable activity not found");
  return res;
}

export async function createTimetableActivity(
  input: TimetableActivityCreateInput
): Promise<TimetableActivityResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateTimetableActivity(
  id: string,
  patch: TimetableActivityUpdateInput
): Promise<TimetableActivityResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("Timetable activity not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteTimetableActivity(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("Timetable activity not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
