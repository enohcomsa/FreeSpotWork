import type {
  EventCreateRequest,
  EventUpdateRequest,
  EventResponseDto,
} from "../schemas/events.zod";
import * as repo from "../repos/events.repo";
import { NotFoundError } from "../errors/app-errors";
import { mapMongoError } from "../errors/mongo-error.mapper";

export async function getEvents(): Promise<EventResponseDto[]> {
  return repo.listEvents();
}

export async function getEvent(id: string): Promise<EventResponseDto> {
  const res = await repo.getEventById(id);

  if (!res) {
    throw new NotFoundError("Event not found");
  }

  return res;
}

export async function createEvent(
  input: EventCreateRequest,
): Promise<EventResponseDto> {
  try {
    return await repo.createEvent(input);
  } catch (error) {
    mapMongoError(error);
  }
}

export async function updateEvent(
  id: string,
  patch: EventUpdateRequest,
): Promise<EventResponseDto> {
  let res: EventResponseDto | null;

  try {
    res = await repo.updateEventById(id, patch);
  } catch (error) {
    mapMongoError(error);
  }

  if (!res) {
    throw new NotFoundError("Event not found");
  }

  return res;
}

export async function deleteEvent(id: string): Promise<boolean> {
  let ok: boolean;

  try {
    ok = await repo.deleteEventById(id);
  } catch (error) {
    mapMongoError(error);
  }

  if (!ok) {
    throw new NotFoundError("Event not found");
  }

  return ok;
}
