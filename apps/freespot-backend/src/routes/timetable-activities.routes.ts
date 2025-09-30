import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  TimetableActivityCreate,
  TimetableActivityUpdate,
  TimetableActivityIdParam,
} from "../schemas/timetable-activities.zod";
import * as ctrl from "../controllers/timetable-activities.controller";

const r = Router();

r.get("/:id", validate({ params: TimetableActivityIdParam }), ctrl.getById);
r.post("/", validate({ body: TimetableActivityCreate }), ctrl.create);
r.patch("/:id", validate({ params: TimetableActivityIdParam, body: TimetableActivityUpdate }), ctrl.update);
r.delete("/:id", validate({ params: TimetableActivityIdParam }), ctrl.destroy);

export default r;
