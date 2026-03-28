import { Router } from "express";
import { validate } from "../middlewares/validate";
import { UserUpdate, UserIdParam, UserMeProfileUpdate } from "../schemas/users.zod";
import * as ctrl from "../controllers/users.controller";
import { requireAuth, requireRole } from "../middlewares/auth.guard";

const r = Router();

r.get("/", ctrl.list);

r.patch("/me/profile", requireAuth, validate({ body: UserMeProfileUpdate }), ctrl.patchMyProfile);

r.get("/:id", validate({ params: UserIdParam }), ctrl.getById);
r.patch("/:id", requireRole("ADMIN"), validate({ params: UserIdParam, body: UserUpdate }), ctrl.update);
r.delete("/:id", requireRole("ADMIN"), validate({ params: UserIdParam }), ctrl.destroy);

export default r;
