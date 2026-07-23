import type {
  EventIdParamT,
  EventCreateRequest,
  EventUpdateRequest,
  EventResponseDto
} from "../schemas/events.zod";
import * as svc from "../services/events.service";
import { withAuthenticatedParams, withAuthenticatedBody, withAuthenticatedParamsAndBody, withAuthenticatedRequest } from "../utils/async-handler";

export const list = withAuthenticatedRequest<EventResponseDto[]>()(async (_req, res) => {
  const data = await svc.getEvents();
  res.json(data);
});

export const getById = withAuthenticatedParams<EventIdParamT, EventResponseDto>()(async (req, res) => {
  const data = await svc.getEvent(req.params.id);
  res.json(data);
});

export const create = withAuthenticatedBody<EventCreateRequest, EventResponseDto>()(async (req, res) => {
  const data = await svc.createEvent(req.body);
  res.status(201).json(data);
});

export const update = withAuthenticatedParamsAndBody<EventIdParamT, EventUpdateRequest, EventResponseDto>()(async (req, res) => {
  const data = await svc.updateEvent(req.params.id, req.body);
  res.json(data);
});

export const destroy = withAuthenticatedParams<EventIdParamT, void>()(async (req, res) => {
  await svc.deleteEvent(req.params.id);
  res.status(204).end();
});
