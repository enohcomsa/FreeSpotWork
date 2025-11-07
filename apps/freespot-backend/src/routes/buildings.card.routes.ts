import { Router } from "express";
import { validate } from "../middlewares/validate";
import * as ctrl from "../controllers/buildings.card.controller";
import { BuildingCardIdParam } from "../schemas/buildings.card.zod";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: BuildingCardIdParam }), ctrl.getById);

export default r;
