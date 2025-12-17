import * as repo from "../repos/timetable-activities.card.repo";
import { NotFoundError } from "./errors";
import { TimetableActivityCardDto } from "../schemas/timetable-activities.card.zod";

export async function listTimetableActivityCards(): Promise<TimetableActivityCardDto[]> {
  return repo.listTimetableActivityCards();
}

export async function getTimetableActivityCard(id: string): Promise<TimetableActivityCardDto> {
  const res = await repo.getTimetableActivityCard(id);
  if (!res) throw new NotFoundError("Timetable Activity not found");
  return res;
}

export async function listTimetableActivityCardsByRoomId(roomId: string): Promise<TimetableActivityCardDto[]> {
  const res = await repo.listTimetableActivityCardsByRoomId(roomId);
  if (!res) throw new NotFoundError("Timetable Activity not found");
  return res;
}
