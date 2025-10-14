import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  BuildingCreate,
  BuildingUpdate,
  BuildingResponse,
  BuildingIdParam,

} from "../../schemas/buildings.zod";
import { z } from "zod";


export function registerBuildings(registry: OpenAPIRegistry) {
  registry.register("BuildingResponse", BuildingResponse);
  registry.register("BuildingCreate", BuildingCreate);
  registry.register("BuildingUpdate", BuildingUpdate);
  registry.register("BuildingIdParam", BuildingIdParam);

  registry.registerPath({
    method: "get",
    path: "/buildings",
    operationId: "buildingsGet",
    tags: ["Buildings"],
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: z.array(BuildingResponse) } },
      },
      500: { description: "Internal server error" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/buildings/{id}",
    operationId: "buildingsIdGet",
    tags: ["Buildings"],
    request: { params: BuildingIdParam },
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: BuildingResponse } },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/buildings",
    operationId: "buildingsPost",
    tags: ["Buildings"],
    request: {
      body: {
        content: { "application/json": { schema: BuildingCreate } },
      },
    },
    responses: {
      201: {
        description: "Created",
        content: { "application/json": { schema: BuildingResponse } },
      },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/buildings/{id}",
    operationId: "buildingsIdPatch",
    tags: ["Buildings"],
    request: {
      params: BuildingIdParam,
      body: {
        content: { "application/merge-patch+json": { schema: BuildingUpdate } },
      },
    },
    responses: {
      200: {
        description: "Updated",
        content: { "application/json": { schema: BuildingResponse } },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/buildings/{id}",
    operationId: "buildingsIdDelete",
    tags: ["Buildings"],
    request: { params: BuildingIdParam },
    responses: {
      204: { description: "Deleted" },
      404: { description: "Not found" },
    },
  });
}
