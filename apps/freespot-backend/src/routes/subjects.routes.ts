import { Router } from "express";
import { validate } from "../middlewares/validate";
import { SubjectCreate, SubjectUpdate, SubjectIdParam } from "../schemas/subjects.zod";
import * as ctrl from "../controllers/subjects.controller";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: SubjectIdParam }), ctrl.getById);
r.post("/", validate({ body: SubjectCreate }), ctrl.create);
r.patch("/:id", validate({ params: SubjectIdParam, body: SubjectUpdate }), ctrl.update);
r.delete("/:id", validate({ params: SubjectIdParam }), ctrl.destroy);

export default r;
