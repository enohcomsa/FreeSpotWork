import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { ProgramYearCreate, ProgramYearUpdate, ProgramYearResponse, ProgramYearIdParam } from "../../schemas/program-years.zod";

export function registerProgramYears(registry: OpenAPIRegistry) {
  registry.register("ProgramYearResponse", ProgramYearResponse);
  registry.register("ProgramYearCreate", ProgramYearCreate);
  registry.register("ProgramYearUpdate", ProgramYearUpdate);
  registry.register("ProgramYearIdParam", ProgramYearIdParam);

  registry.registerPath({ method: "get", path: "/program-years/{id}", operationId: "programYearsIdGet", tags: ["Program Years"], request: { params: ProgramYearIdParam }, responses: { 200: { description: "OK", content: { "application/json": { schema: ProgramYearResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "post", path: "/program-years", operationId: "programYearsPost", tags: ["Program Years"], request: { body: { content: { "application/json": { schema: ProgramYearCreate } } } }, responses: { 201: { description: "Created", content: { "application/json": { schema: ProgramYearResponse } } } } });
  registry.registerPath({ method: "patch", path: "/program-years/{id}", operationId: "programYearsIdPatch", tags: ["Program Years"], request: { params: ProgramYearIdParam, body: { content: { "application/merge-patch+json": { schema: ProgramYearUpdate } } } }, responses: { 200: { description: "Updated", content: { "application/json": { schema: ProgramYearResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "delete", path: "/program-years/{id}", operationId: "programYearsIdDelete", tags: ["Program Years"], request: { params: ProgramYearIdParam }, responses: { 204: { description: "Deleted" }, 404: { description: "Not found" } } });
}
