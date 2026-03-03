import { Router } from "express";
import { validate } from "../middlewares/validate";
import { FacultyCreate, FacultyUpdate, FacultyIdParam } from "../schemas/faculties.zod";
import * as ctrl from "../controllers/faculties.controller";
import { requireRole } from "../middlewares/auth.guard";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: FacultyIdParam }), ctrl.getById);

r.post("/", requireRole("ADMIN"), validate({ body: FacultyCreate }), ctrl.create);
r.patch("/:id", requireRole("ADMIN"), validate({ params: FacultyIdParam, body: FacultyUpdate }), ctrl.update);
r.delete("/:id", requireRole("ADMIN"), validate({ params: FacultyIdParam }), ctrl.destroy);

export default r;
