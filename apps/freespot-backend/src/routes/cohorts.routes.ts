import { Router } from "express";
import { validate } from "../middlewares/validate";
import { CohortCreate, CohortUpdate, CohortIdParam } from "../schemas/cohorts.zod";
import * as ctrl from "../controllers/cohorts.controller";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: CohortIdParam }), ctrl.getById);
r.post("/", validate({ body: CohortCreate }), ctrl.create);
r.patch("/:id", validate({ params: CohortIdParam, body: CohortUpdate }), ctrl.update);
r.delete("/:id", validate({ params: CohortIdParam }), ctrl.destroy);

export default r;
