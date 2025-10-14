import { Router } from "express";
import { validate } from "../middlewares/validate";
import { BuildingCreate, BuildingUpdate, BuildingIdParam } from "../schemas/buildings.zod";
import * as ctrl from "../controllers/buildings.controller";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: BuildingIdParam }), ctrl.getById);
r.post("/", validate({ body: BuildingCreate }), ctrl.create);
r.patch("/:id", validate({ params: BuildingIdParam, body: BuildingUpdate }), ctrl.update);
r.delete("/:id", validate({ params: BuildingIdParam }), ctrl.destroy);

export default r;
