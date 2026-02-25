import { Router } from "express";
import { validate } from "../middlewares/validate";
import { BookingCreate, BookingUpdate, BookingIdParam } from "../schemas/bookings.zod";
import * as ctrl from "../controllers/bookings.controller";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: BookingIdParam }), ctrl.getById);
r.post("/", validate({ body: BookingCreate }), ctrl.create);
r.patch("/:id", validate({ params: BookingIdParam, body: BookingUpdate }), ctrl.update);
r.delete("/:id", validate({ params: BookingIdParam }), ctrl.destroy);

export default r;
