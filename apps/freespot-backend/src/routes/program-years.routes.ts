import { Router } from "express";
import { validate } from "../middlewares/validate";
import { ProgramYearCreate, ProgramYearUpdate, ProgramYearIdParam } from "../schemas/program-years.zod";
import * as ctrl from "../controllers/program-years.controller";

const r = Router();

r.get("/:id", validate({ params: ProgramYearIdParam }), ctrl.getById);
r.post("/", validate({ body: ProgramYearCreate }), ctrl.create);
r.patch("/:id", validate({ params: ProgramYearIdParam, body: ProgramYearUpdate }), ctrl.update);
r.delete("/:id", validate({ params: ProgramYearIdParam }), ctrl.destroy);

export default r;
