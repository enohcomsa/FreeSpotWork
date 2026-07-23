import { Router } from "express";
import { validate } from "../middlewares/validate";
import { BookingCreate, BookingUpdate, BookingReschedule, BookingIdParam, BookingUserIdParam } from "../schemas/bookings.zod";
import * as ctrl from "../controllers/bookings.controller";
import { requireRole } from "../middlewares/auth.guard";

const r = Router();

r.get("/", ctrl.listMine);
r.get("/admin/user/:userId", requireRole("ADMIN"), validate({ params: BookingUserIdParam }), ctrl.listByUserIdAdmin);
r.get("/:id", validate({ params: BookingIdParam }), ctrl.getById);

r.post("/", validate({ body: BookingCreate }), ctrl.create);

r.patch("/:id", validate({ params: BookingIdParam, body: BookingReschedule }), ctrl.reschedule);
r.patch("/:id/admin", requireRole("ADMIN"), validate({ params: BookingIdParam, body: BookingUpdate }), ctrl.update);

r.delete("/:id", validate({ params: BookingIdParam }), ctrl.destroy);

export default r;
