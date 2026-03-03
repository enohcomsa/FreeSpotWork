import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  TimetableActivityCreate,
  TimetableActivityUpdate,
  TimetableActivityIdParam,
} from "../schemas/timetable-activities.zod";
import * as ctrl from "../controllers/timetable-activities.controller";
import { requireRole } from "../middlewares/auth.guard";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: TimetableActivityIdParam }), ctrl.getById);

r.post("/", requireRole("ADMIN"), validate({ body: TimetableActivityCreate }), ctrl.create);
r.patch("/:id", requireRole("ADMIN"), validate({ params: TimetableActivityIdParam, body: TimetableActivityUpdate }), ctrl.update);
r.delete("/:id", requireRole("ADMIN"), validate({ params: TimetableActivityIdParam }), ctrl.destroy);

export default r;
