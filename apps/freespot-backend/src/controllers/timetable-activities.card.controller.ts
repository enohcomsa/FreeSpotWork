import { TimetableActivityCardDto, TimetableActivityCardIdParamT } from "../schemas/timetable-activities.card.zod";
import * as svc from "../services/timetable-activities.card.service";
import { withParams, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, TimetableActivityCardDto[]>()(async (_req, res) => {
  const data = await svc.listTimetableActivityCards();
  res.json(data);
});

export const getById = withParams<TimetableActivityCardIdParamT, TimetableActivityCardDto>()(async (_req, res) => {
  const data = await svc.getTimetableActivityCard(_req.params.id);
  res.json(data);
});

export const listByRoomId = withParams<TimetableActivityCardIdParamT, TimetableActivityCardDto[]>()(async (_req, res) => {
  const data = await svc.listTimetableActivityCardsByRoomId(_req.params.id);
  res.json(data);
});
