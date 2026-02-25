import { Router } from "express";
import { validate } from "../middlewares/validate";
import { RoomCreate, RoomUpdate, RoomIdParam } from "../schemas/rooms.zod";
import * as ctrl from "../controllers/rooms.controller";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: RoomIdParam }), ctrl.getById);
r.post("/", validate({ body: RoomCreate }), ctrl.create);
r.patch("/:id", validate({ params: RoomIdParam, body: RoomUpdate }), ctrl.update);
r.delete("/:id", validate({ params: RoomIdParam }), ctrl.destroy);

export default r;
