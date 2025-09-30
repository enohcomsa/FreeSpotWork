import type {
  TimetableActivityCreateInput,
  TimetableActivityUpdateInput,
  TimetableActivityIdParamInput,
  TimetableActivityResponseDto,
} from "../schemas/timetable-activities.zod";
import * as svc from "../services/timetable-activities.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<TimetableActivityIdParamInput, TimetableActivityResponseDto>()(
  async (req, res) => {
    const data = await svc.getTimetableActivity(req.params.id);
    res.json(data);
  }
);

export const create = withBody<TimetableActivityCreateInput, TimetableActivityResponseDto>()(
  async (req, res) => {
    const data = await svc.createTimetableActivity(req.body);
    res.status(201).json(data);
  }
);

export const update = withParamsAndBody<
  TimetableActivityIdParamInput,
  TimetableActivityUpdateInput,
  TimetableActivityResponseDto
>()(async (req, res) => {
  const data = await svc.updateTimetableActivity(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<TimetableActivityIdParamInput, void>()(async (req, res) => {
  await svc.deleteTimetableActivity(req.params.id);
  res.status(204).end();
});
