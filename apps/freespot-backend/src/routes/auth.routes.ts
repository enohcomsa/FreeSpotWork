import { Router } from "express";
import { validate } from "../middlewares/validate";
import { AvailabilityQuery } from "../schemas/availability.zod";
// import * as ctrl from "../controllers/availability.controller";

const r = Router();

// r.get("/", validate({ query: AvailabilityQuery }), ctrl.list);


// POST /auth/signup

// POST /auth/login

// POST /auth/refresh

// POST /auth/logout
export default r;//maybe update later
