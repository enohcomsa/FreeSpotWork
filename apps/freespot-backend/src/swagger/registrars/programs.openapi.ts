import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { ProgramCreate, ProgramUpdate, ProgramResponse, ProgramIdParam } from "../../schemas/programs.zod";

export function registerPrograms(registry: OpenAPIRegistry) {
  registry.register("ProgramResponse", ProgramResponse);
  registry.register("ProgramCreate", ProgramCreate);
  registry.register("ProgramUpdate", ProgramUpdate);

  registry.registerPath({ method: "get", path: "/programs/{id}", tags: ["Programs"], request: { params: ProgramIdParam }, responses: { 200: { description: "OK", content: { "application/json": { schema: ProgramResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "post", path: "/programs", tags: ["Programs"], request: { body: { content: { "application/json": { schema: ProgramCreate } } } }, responses: { 201: { description: "Created", content: { "application/json": { schema: ProgramResponse } } } } });
  registry.registerPath({ method: "patch", path: "/programs/{id}", tags: ["Programs"], request: { params: ProgramIdParam, body: { content: { "application/json": { schema: ProgramUpdate } } } }, responses: { 200: { description: "Updated", content: { "application/json": { schema: ProgramResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "delete", path: "/programs/{id}", tags: ["Programs"], request: { params: ProgramIdParam }, responses: { 204: { description: "Deleted" }, 404: { description: "Not found" } } });
}
