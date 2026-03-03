import { Router } from "express";
import { validate } from "../middlewares/validate";
import { ProgramCreate, ProgramUpdate, ProgramIdParam } from "../schemas/programs.zod";
import * as ctrl from "../controllers/programs.controller";
import { requireRole } from "../middlewares/auth.guard";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: ProgramIdParam }), ctrl.getById);

r.post("/", requireRole("ADMIN"), validate({ body: ProgramCreate }), ctrl.create);
r.patch("/:id", requireRole("ADMIN"), validate({ params: ProgramIdParam, body: ProgramUpdate }), ctrl.update);
r.delete("/:id", requireRole("ADMIN"), validate({ params: ProgramIdParam }), ctrl.destroy);

export default r;
