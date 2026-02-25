import { Router } from "express";
import { validate } from "../middlewares/validate";
import { FloorCreate, FloorUpdate, FloorIdParam } from "../schemas/floors.zod";
import * as ctrl from "../controllers/floors.controller";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: FloorIdParam }), ctrl.getById);
r.post("/", validate({ body: FloorCreate }), ctrl.create);
r.patch("/:id", validate({ params: FloorIdParam, body: FloorUpdate }), ctrl.update);
r.delete("/:id", validate({ params: FloorIdParam }), ctrl.destroy);

export default r;
