import { Router } from "express";
import { validate } from "../middlewares/validate";
import { SubjectCreate, SubjectUpdate, SubjectIdParam } from "../schemas/subjects.zod";
import * as ctrl from "../controllers/subjects.controller";
import { requireRole } from "../middlewares/auth.guard";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: SubjectIdParam }), ctrl.getById);

r.post("/", requireRole("ADMIN"), validate({ body: SubjectCreate }), ctrl.create);
r.patch("/:id", requireRole("ADMIN"), validate({ params: SubjectIdParam, body: SubjectUpdate }), ctrl.update);
r.delete("/:id", requireRole("ADMIN"), validate({ params: SubjectIdParam }), ctrl.destroy);

export default r;
