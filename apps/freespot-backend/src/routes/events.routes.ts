import { Router } from "express";
import { validate } from "../middlewares/validate";
import { EventCreate, EventUpdate, EventIdParam } from "../schemas/events.zod";
import * as ctrl from "../controllers/events.controller";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: EventIdParam }), ctrl.getById);
r.post("/", validate({ body: EventCreate }), ctrl.create);
r.patch("/:id", validate({ params: EventIdParam, body: EventUpdate }), ctrl.update);
r.delete("/:id", validate({ params: EventIdParam }), ctrl.destroy);

export default r;
