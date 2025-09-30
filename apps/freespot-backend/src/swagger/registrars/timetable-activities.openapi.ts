import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { TimetableActivityCreate, TimetableActivityUpdate, TimetableActivityResponse, TimetableActivityIdParam } from "../../schemas/timetable-activities.zod";

export function registerTimetableActivities(registry: OpenAPIRegistry) {
  registry.register("TimetableActivityResponse", TimetableActivityResponse);
  registry.register("TimetableActivityCreate", TimetableActivityCreate);
  registry.register("TimetableActivityUpdate", TimetableActivityUpdate);

  registry.registerPath({ method: "get", path: "/timetable-activities/{id}", tags: ["Timetable Activities"], request: { params: TimetableActivityIdParam }, responses: { 200: { description: "OK", content: { "application/json": { schema: TimetableActivityResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "post", path: "/timetable-activities", tags: ["Timetable Activities"], request: { body: { content: { "application/json": { schema: TimetableActivityCreate } } } }, responses: { 201: { description: "Created", content: { "application/json": { schema: TimetableActivityResponse } } } } });
  registry.registerPath({ method: "patch", path: "/timetable-activities/{id}", tags: ["Timetable Activities"], request: { params: TimetableActivityIdParam, body: { content: { "application/json": { schema: TimetableActivityUpdate } } } }, responses: { 200: { description: "Updated", content: { "application/json": { schema: TimetableActivityResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "delete", path: "/timetable-activities/{id}", tags: ["Timetable Activities"], request: { params: TimetableActivityIdParam }, responses: { 204: { description: "Deleted" }, 404: { description: "Not found" } } });
}
