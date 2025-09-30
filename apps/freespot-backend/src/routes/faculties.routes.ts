import { Router } from "express";
import { validate } from "../middlewares/validate";
import { FacultyCreate, FacultyUpdate, FacultyIdParam } from "../schemas/faculties.zod";
import * as ctrl from "../controllers/faculties.controller";

const r = Router();

r.get("/:id", validate({ params: FacultyIdParam }), ctrl.getById);
r.post("/", validate({ body: FacultyCreate }), ctrl.create);
r.patch("/:id", validate({ params: FacultyIdParam, body: FacultyUpdate }), ctrl.update);
r.delete("/:id", validate({ params: FacultyIdParam }), ctrl.destroy);

export default r;
