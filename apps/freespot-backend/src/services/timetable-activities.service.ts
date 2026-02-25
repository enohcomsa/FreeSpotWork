import type { TimetableActivityCreateRequest, TimetableActivityUpdateRequest, TimetableActivityResponseDto } from "../schemas/timetable-activities.zod";
import * as repo from "../repos/timetable-activities.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getTimetableActivities(): Promise<TimetableActivityResponseDto[]> { return repo.listTimetableActivities(); }

export async function getTimetableActivity(id: string): Promise<TimetableActivityResponseDto> {
  const res = await repo.getTimetableActivityById(id);
  if (!res) throw new NotFoundError("Timetable activity not found");
  return res;
}

export async function createTimetableActivity(input: TimetableActivityCreateRequest): Promise<TimetableActivityResponseDto> {
  try { return await repo.createTimetableActivity(input); } catch (e) { mapMongoError(e); }
}

export async function updateTimetableActivity(id: string, patch: TimetableActivityUpdateRequest): Promise<TimetableActivityResponseDto> {
  try {
    const res = await repo.updateTimetableActivityById(id, patch);
    if (!res) throw new NotFoundError("Timetable activity not found");
    return res;
  } catch (e) { mapMongoError(e); }
}

export async function deleteTimetableActivity(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteTimetableActivityById(id);
    if (!ok) throw new NotFoundError("Timetable activity not found");
    return ok;
  } catch (e) { mapMongoError(e); }
}
