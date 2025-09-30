import { Router } from "express";
import { validate } from "../middlewares/validate";
import { AvailabilityQuery } from "../schemas/availability.zod";
import * as ctrl from "../controllers/availability.controller";

const r = Router();

r.get("/", validate({ query: AvailabilityQuery }), ctrl.list);

export default r;
