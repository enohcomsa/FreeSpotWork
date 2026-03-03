import "../swagger/zod-openapi";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import {
  registerAvailability, registerBookings, registerBuildings, registerBuildingsCards, registerCohorts,
  registerEvents,
  registerFaculties, registerFloors, registerPrograms, registerProgramYears, registerRooms, registerSubjects, registerTimetableActivities, registerTimetableActivityCards, registerUsers
} from "./registrars";
import { registerAuth } from "./registrars/auth.openapi";


export function setupSwagger(app: Express) {
  const registry = new OpenAPIRegistry();

  registerAuth(registry);
  registerBookings(registry);
  registerProgramYears(registry);
  registerPrograms(registry);
  registerSubjects(registry);
  registerRooms(registry);
  registerTimetableActivities(registry);
  registerTimetableActivityCards(registry);
  registerUsers(registry);
  registerAvailability(registry);
  registerBuildings(registry);
  registerBuildingsCards(registry);
  registerFloors(registry);
  registerFaculties(registry);
  registerCohorts(registry);
  registerEvents(registry);

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const doc = generator.generateDocument({
    openapi: "3.0.3",
    info: { title: "FreeSpot API", version: "1.0.0" },
    tags: [
      { name: "Auth" },
      { name: "Bookings" },
      { name: "Program Years" },
      { name: "Programs" },
      { name: "Subjects" },
      { name: "Rooms" },
      { name: "Timetable Activities" },
      { name: "Timetable Activity Cards" },
      { name: "Users" },
      { name: "Availability" },
      { name: "Buildings" },
      { name: "Buildings Cards" },
      { name: "Floors" },
      { name: "Faculties" },
      { name: "Cohorts" },
      { name: "Events" }
    ],
  });

  app.get("/openapi.json", (_req, res) => {
    const proto = (_req.headers["x-forwarded-proto"] as string) || _req.protocol;
    const host = _req.get("host");
    res.json({ ...doc, servers: [{ url: `${proto}://${host}/api/v1` }] });
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(doc, { explorer: true }));
}
