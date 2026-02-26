import { Router } from "express";
import buildings from "./buildings.routes";
import buildingsCards from "./buildings.card.routes";
import floors from "./floors.routes";
import rooms from "./rooms.routes";
import subjects from "./subjects.routes";
import faculties from "./faculties.routes";
import programs from "./programs.routes";
import programYears from "./program-years.routes";
import cohorts from "./cohorts.routes";
import users from "./users.routes";
import bookings from "./bookings.routes";
import timetableActivities from "./timetable-activities.routes";
import timetableActivitiesCards from "./timetable-activities.card.routes";
import availability from "./availability.routes";
import eventsRoutes from "./events.routes";
import auth from "./auth.routes";//maybe update later

const api = Router();

api.use("/buildings", buildings);
api.use("/buildings-cards", buildingsCards);
api.use("/floors", floors);
api.use("/rooms", rooms);
api.use("/subjects", subjects);
api.use("/faculties", faculties);
api.use("/programs", programs);
api.use("/program-years", programYears);
api.use("/cohorts", cohorts);
api.use("/users", users);
api.use("/bookings", bookings);
api.use("/timetable-activities", timetableActivities);
api.use("/timetable-activities-cards", timetableActivitiesCards);
api.use("/availability", availability);
api.use("/events", eventsRoutes);
api.use("/auth", auth);//maybe update later

export default api;
