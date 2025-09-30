import { Router } from "express";
import { validate } from "../middlewares/validate";
import { ProgramCreate, ProgramUpdate, ProgramIdParam } from "../schemas/programs.zod";
import * as ctrl from "../controllers/programs.controller";

const r = Router();

r.get("/:id", validate({ params: ProgramIdParam }), ctrl.getById);
r.post("/", validate({ body: ProgramCreate }), ctrl.create);
r.patch("/:id", validate({ params: ProgramIdParam, body: ProgramUpdate }), ctrl.update);
r.delete("/:id", validate({ params: ProgramIdParam }), ctrl.destroy);

export default r;
