import { Router } from "express";
import { validate } from "../middlewares/validate";
import { UserCreate, UserUpdate, UserIdParam } from "../schemas/users.zod";
import * as ctrl from "../controllers/users.controller";

const r = Router();

r.get("/", ctrl.list);
r.get("/:id", validate({ params: UserIdParam }), ctrl.getById);
r.post("/", validate({ body: UserCreate }), ctrl.create);
r.patch("/:id", validate({ params: UserIdParam, body: UserUpdate }), ctrl.update);
r.delete("/:id", validate({ params: UserIdParam }), ctrl.destroy);

export default r;
