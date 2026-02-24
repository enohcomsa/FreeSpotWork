import "../swagger/zod-openapi";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import {
  registerAvailability, registerBookings, registerBuildings, registerBuildingsCards, registerCohorts,
  registerEvents,
  registerFaculties, registerFloors, registerPrograms, registerProgramYears, registerRooms, registerSubjects, registerTimetableActivities, registerTimetableActivityCards, registerUsers
} from "./registrars";


export function setupSwagger(app: Express) {
  const registry = new OpenAPIRegistry();

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
    servers: [{ url: "/api/v1" }],
    tags: [
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

  app.get("/openapi.json", (_req, res) => res.json(doc));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(doc, { explorer: true }));
}
