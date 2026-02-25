import { Router } from "express";
import { validate } from "../middlewares/validate";
import * as ctrl from "../controllers/timetable-activities.card.controller";
import { TimetableActivityCardIdParam } from "../schemas/timetable-activities.card.zod";

const r = Router();

r.get("/", ctrl.list);
r.get("/room/:id", validate({ params: TimetableActivityCardIdParam }), ctrl.listByRoomId);
r.get("/:id", validate({ params: TimetableActivityCardIdParam }), ctrl.getById);

export default r;
