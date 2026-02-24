import type { EventCreateRequest, EventUpdateRequest, EventResponseDto } from "../schemas/events.zod";
import * as repo from "../repos/events.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getEvents(): Promise<EventResponseDto[]> {
  return repo.listEvents();
}

export async function getEvent(id: string): Promise<EventResponseDto> {
  const res = await repo.getEventById(id);
  if (!res) throw new NotFoundError("Event not found");
  return res;
}

export async function createEvent(input: EventCreateRequest): Promise<EventResponseDto> {
  try { return await repo.createEvent(input); }
  catch (e) { mapMongoError(e); }
}

export async function updateEvent(id: string, patch: EventUpdateRequest): Promise<EventResponseDto> {
  try {
    const res = await repo.updateEventById(id, patch);
    if (!res) throw new NotFoundError("Event not found");
    return res;
  } catch (e) { mapMongoError(e); }
}

export async function deleteEvent(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteEventById(id);
    if (!ok) throw new NotFoundError("Event not found");
    return ok;
  } catch (e) { mapMongoError(e); }
}
