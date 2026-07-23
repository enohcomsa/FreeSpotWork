import type { TimetableActivityIdParamT, TimetableActivityCreateRequest, TimetableActivityUpdateRequest, TimetableActivityResponseDto } from "../schemas/timetable-activities.zod";
import * as svc from "../services/timetable-activities.service";
import { withAuthenticatedParams, withAuthenticatedBody, withAuthenticatedParamsAndBody, withAuthenticatedRequest } from "../utils/async-handler";

export const list = withAuthenticatedRequest<TimetableActivityResponseDto[]>()(async (_req, res) => {
  const data = await svc.getTimetableActivities();
  res.json(data);
});

export const getById = withAuthenticatedParams<TimetableActivityIdParamT, TimetableActivityResponseDto>()(async (req, res) => {
  const data = await svc.getTimetableActivity(req.params.id);
  res.json(data);
});

export const create = withAuthenticatedBody<TimetableActivityCreateRequest, TimetableActivityResponseDto>()(async (req, res) => {
  const data = await svc.createTimetableActivity(req.body);
  res.status(201).json(data);
});

export const update = withAuthenticatedParamsAndBody<TimetableActivityIdParamT, TimetableActivityUpdateRequest, TimetableActivityResponseDto>()(async (req, res) => {
  const data = await svc.updateTimetableActivity(req.params.id, req.body);
  res.json(data);
});

export const destroy = withAuthenticatedParams<TimetableActivityIdParamT, void>()(async (req, res) => {
  await svc.deleteTimetableActivity(req.params.id);
  res.status(204).end();
});
