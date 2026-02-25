import type { TimetableActivityIdParamT, TimetableActivityCreateRequest, TimetableActivityUpdateRequest, TimetableActivityResponseDto } from "../schemas/timetable-activities.zod";
import * as svc from "../services/timetable-activities.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, TimetableActivityResponseDto[]>()(async (_req, res) => {
  const data = await svc.getTimetableActivities();
  res.json(data);
});

export const getById = withParams<TimetableActivityIdParamT, TimetableActivityResponseDto>()(async (req, res) => {
  const data = await svc.getTimetableActivity(req.params.id);
  res.json(data);
});

export const create = withBody<TimetableActivityCreateRequest, TimetableActivityResponseDto>()(async (req, res) => {
  const data = await svc.createTimetableActivity(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<TimetableActivityIdParamT, TimetableActivityUpdateRequest, TimetableActivityResponseDto>()(async (req, res) => {
  const data = await svc.updateTimetableActivity(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<TimetableActivityIdParamT, void>()(async (req, res) => {
  await svc.deleteTimetableActivity(req.params.id);
  res.status(204).end();
});
