import { Router } from "express";
import { validate } from "../middlewares/validate";
import { SignupSchema, LoginSchema, RefreshSchema } from "../schemas/auth.zod";
import * as ctrl from "../controllers/auth.controller";
import { rateLimitLogin, rateLimitRefresh, rateLimitSignup } from "../middlewares/auth.rate-limit";

const r = Router();

r.post("/signup", rateLimitSignup, validate({ body: SignupSchema }), ctrl.signup);
r.post("/login", rateLimitLogin, validate({ body: LoginSchema }), ctrl.login);
r.post("/refresh", rateLimitRefresh, validate({ body: RefreshSchema }), ctrl.refresh);
r.post("/logout", ctrl.logout);
r.get("/me", ctrl.me);

export default r;
