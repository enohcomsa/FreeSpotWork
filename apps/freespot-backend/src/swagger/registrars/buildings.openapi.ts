import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { BuildingCreate, BuildingUpdate, BuildingResponse, BuildingIdParam } from "../../schemas/buildings.zod";

export function registerBuildings(registry: OpenAPIRegistry) {
  registry.register("BuildingResponse", BuildingResponse);
  registry.register("BuildingCreate", BuildingCreate);
  registry.register("BuildingUpdate", BuildingUpdate);

  registry.registerPath({ method: "get", path: "/buildings/{id}", tags: ["Buildings"], request: { params: BuildingIdParam }, responses: { 200: { description: "OK", content: { "application/json": { schema: BuildingResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "post", path: "/buildings", tags: ["Buildings"], request: { body: { content: { "application/json": { schema: BuildingCreate } } } }, responses: { 201: { description: "Created", content: { "application/json": { schema: BuildingResponse } } } } });
  registry.registerPath({ method: "patch", path: "/buildings/{id}", tags: ["Buildings"], request: { params: BuildingIdParam, body: { content: { "application/json": { schema: BuildingUpdate } } } }, responses: { 200: { description: "Updated", content: { "application/json": { schema: BuildingResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "delete", path: "/buildings/{id}", tags: ["Buildings"], request: { params: BuildingIdParam }, responses: { 204: { description: "Deleted" }, 404: { description: "Not found" } } });
}
