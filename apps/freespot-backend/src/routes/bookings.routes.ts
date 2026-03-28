import { Router } from "express";
import { validate } from "../middlewares/validate";
import { BookingCreate, BookingUpdate, BookingReschedule, BookingIdParam } from "../schemas/bookings.zod";
import * as ctrl from "../controllers/bookings.controller";
import { requireAuth, requireRole } from "../middlewares/auth.guard";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: BookingIdParam }), ctrl.getById);

r.post("/", requireRole("ADMIN"), validate({ body: BookingCreate }), ctrl.create);

// user reschedule endpoint
r.patch("/:id", requireAuth, validate({ params: BookingIdParam, body: BookingReschedule }), ctrl.reschedule);

// admin raw patch - keep only if you still want it
r.patch("/:id/admin", requireRole("ADMIN"), validate({ params: BookingIdParam, body: BookingUpdate }), ctrl.update);

r.delete("/:id", requireAuth, validate({ params: BookingIdParam }), ctrl.destroy);

export default r;
