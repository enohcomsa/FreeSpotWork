import { TimetableActivityCardDto, TimetableActivityCardIdParamT } from "../schemas/timetable-activities.card.zod";
import * as svc from "../services/timetable-activities.card.service";
import { withAuthenticatedParams, withAuthenticatedRequest } from "../utils/async-handler";

export const list = withAuthenticatedRequest<TimetableActivityCardDto[]>()(async (_req, res) => {
  const data = await svc.listTimetableActivityCards();
  res.json(data);
});

export const getById = withAuthenticatedParams<TimetableActivityCardIdParamT, TimetableActivityCardDto>()(async (_req, res) => {
  const data = await svc.getTimetableActivityCard(_req.params.id);
  res.json(data);
});

export const listByRoomId = withAuthenticatedParams<TimetableActivityCardIdParamT, TimetableActivityCardDto[]>()(async (_req, res) => {
  const data = await svc.listTimetableActivityCardsByRoomId(_req.params.id);
  res.json(data);
});
