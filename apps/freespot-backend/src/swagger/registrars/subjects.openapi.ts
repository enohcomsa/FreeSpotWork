import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { SubjectCreate, SubjectUpdate, SubjectResponse, SubjectIdParam } from "../../schemas/subjects.zod";

export function registerSubjects(registry: OpenAPIRegistry) {
  registry.register("SubjectResponse", SubjectResponse);
  registry.register("SubjectCreate", SubjectCreate);
  registry.register("SubjectUpdate", SubjectUpdate);

  registry.registerPath({ method: "get", path: "/subjects/{id}", tags: ["Subjects"], request: { params: SubjectIdParam }, responses: { 200: { description: "OK", content: { "application/json": { schema: SubjectResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "post", path: "/subjects", tags: ["Subjects"], request: { body: { content: { "application/json": { schema: SubjectCreate } } } }, responses: { 201: { description: "Created", content: { "application/json": { schema: SubjectResponse } } } } });
  registry.registerPath({ method: "patch", path: "/subjects/{id}", tags: ["Subjects"], request: { params: SubjectIdParam, body: { content: { "application/json": { schema: SubjectUpdate } } } }, responses: { 200: { description: "Updated", content: { "application/json": { schema: SubjectResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "delete", path: "/subjects/{id}", tags: ["Subjects"], request: { params: SubjectIdParam }, responses: { 204: { description: "Deleted" }, 404: { description: "Not found" } } });
}
