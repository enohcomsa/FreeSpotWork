import { Router } from "express";
import { validate } from "../middlewares/validate";
import { BuildingCreate, BuildingUpdate, BuildingIdParam } from "../schemas/buildings.zod";
import * as ctrl from "../controllers/buildings.controller";
import { requireRole } from "../middlewares/auth.guard";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: BuildingIdParam }), ctrl.getById);

r.post("/", requireRole("ADMIN"), validate({ body: BuildingCreate }), ctrl.create);
r.patch("/:id", requireRole("ADMIN"), validate({ params: BuildingIdParam, body: BuildingUpdate }), ctrl.update);
r.delete("/:id", requireRole("ADMIN"), validate({ params: BuildingIdParam }), ctrl.destroy);

export default r;
