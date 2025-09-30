import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { FacultyCreate, FacultyUpdate, FacultyResponse, FacultyIdParam } from "../../schemas/faculties.zod";

export function registerFaculties(registry: OpenAPIRegistry) {
  registry.register("FacultyResponse", FacultyResponse);
  registry.register("FacultyCreate", FacultyCreate);
  registry.register("FacultyUpdate", FacultyUpdate);

  registry.registerPath({ method: "get", path: "/faculties/{id}", tags: ["Faculties"], request: { params: FacultyIdParam }, responses: { 200: { description: "OK", content: { "application/json": { schema: FacultyResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "post", path: "/faculties", tags: ["Faculties"], request: { body: { content: { "application/json": { schema: FacultyCreate } } } }, responses: { 201: { description: "Created", content: { "application/json": { schema: FacultyResponse } } } } });
  registry.registerPath({ method: "patch", path: "/faculties/{id}", tags: ["Faculties"], request: { params: FacultyIdParam, body: { content: { "application/json": { schema: FacultyUpdate } } } }, responses: { 200: { description: "Updated", content: { "application/json": { schema: FacultyResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "delete", path: "/faculties/{id}", tags: ["Faculties"], request: { params: FacultyIdParam }, responses: { 204: { description: "Deleted" }, 404: { description: "Not found" } } });
}
