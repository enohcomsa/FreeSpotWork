import { Router } from "express";
import { validate } from "../middlewares/validate";
import { RescheduleOptionsQuery } from "../schemas/availability.zod";
import * as ctrl from "../controllers/availability.controller";
import { requireAuth } from "../middlewares/auth.guard";

const r = Router();

r.get("/reschedule-options", requireAuth, validate({ query: RescheduleOptionsQuery }), ctrl.listRescheduleOptions);

export default r;
