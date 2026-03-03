import { Router } from "express";
import { validate } from "../middlewares/validate";
import { ProgramYearCreate, ProgramYearUpdate, ProgramYearIdParam } from "../schemas/program-years.zod";
import * as ctrl from "../controllers/program-years.controller";
import { requireRole } from "../middlewares/auth.guard";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: ProgramYearIdParam }), ctrl.getById);

r.post("/", requireRole("ADMIN"), validate({ body: ProgramYearCreate }), ctrl.create);
r.patch("/:id", requireRole("ADMIN"), validate({ params: ProgramYearIdParam, body: ProgramYearUpdate }), ctrl.update);
r.delete("/:id", requireRole("ADMIN"), validate({ params: ProgramYearIdParam }), ctrl.destroy);

export default r;
