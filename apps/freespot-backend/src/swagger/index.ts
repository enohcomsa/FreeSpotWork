import "../swagger/zod-openapi";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registerBookings } from "./registrars/bookings.openapi";
import { registerProgramYears } from "./registrars/program-years.openapi";
import { registerPrograms } from "./registrars/programs.openapi";
import { registerRooms } from "./registrars/rooms.openapi";
import { registerSubjects } from "./registrars/subjects.openapi";
import { registerTimetableActivities } from "./registrars/timetable-activities.openapi";
import { registerUsers } from "./registrars/users.openapi";
import { registerAvailability } from "./registrars/availability.openapi";
import { registerBuildings } from "./registrars/buildings.openapi";
import { registerFloors } from "./registrars/floors.openapi";
import { registerFaculties } from "./registrars/faculties.openapi";
import { registerCohorts } from "./registrars/cohorts.openapi";

export function setupSwagger(app: Express) {
  const registry = new OpenAPIRegistry();

  registerBookings(registry);
  registerProgramYears(registry);
  registerPrograms(registry);
  registerSubjects(registry);
  registerRooms(registry);
  registerTimetableActivities(registry);
  registerUsers(registry);
  registerAvailability(registry);
  registerBuildings(registry);
  registerFloors(registry);
  registerFaculties(registry);
  registerCohorts(registry);

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const doc = generator.generateDocument({
    openapi: "3.0.3",
    info: { title: "FreeSpot API", version: "1.0.0" },
    servers: [{ url: "/api/v1" }],
    tags: [
      { name: "Bookings" },
      { name: "Program Years" },
      { name: "Programs" },
      { name: "Subjects" },
      { name: "Rooms" },
      { name: "Timetable Activities" },
      { name: "Users" },
      { name: "Availability" },
      { name: "Buildings" },
      { name: "Floors" },
      { name: "Faculties" },
      { name: "Cohorts" },
    ],
  });

  app.get("/openapi.json", (_req, res) => res.json(doc));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(doc, { explorer: true }));
}
