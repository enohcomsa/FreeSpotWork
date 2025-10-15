import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  FloorCreate,
  FloorUpdate,
  FloorResponse,
  FloorIdParam,
} from "../../schemas/floors.zod";
import { z } from "zod";

export function registerFloors(registry: OpenAPIRegistry) {
  registry.register("FloorResponse", FloorResponse);
  registry.register("FloorCreate", FloorCreate);
  registry.register("FloorUpdate", FloorUpdate);
  registry.register("FloorIdParam", FloorIdParam);

  registry.registerPath({
    method: "get",
    path: "/floors",
    operationId: "floorsGet",
    tags: ["Floors"],
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: z.array(FloorResponse) } },
      },
      500: { description: "Internal server error" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/floors/{id}",
    operationId: "floorsIdGet",
    tags: ["Floors"],
    request: { params: FloorIdParam },
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: FloorResponse } },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/floors",
    operationId: "floorsPost",
    tags: ["Floors"],
    request: {
      body: {
        content: { "application/json": { schema: FloorCreate } },
      },
    },
    responses: {
      201: {
        description: "Created",
        content: { "application/json": { schema: FloorResponse } },
      },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/floors/{id}",
    operationId: "floorsIdPatch",
    tags: ["Floors"],
    request: {
      params: FloorIdParam,
      body: {
        content: {
          "application/merge-patch+json": { schema: FloorUpdate },
        },
      },
    },
    responses: {
      200: {
        description: "Updated",
        content: { "application/json": { schema: FloorResponse } },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/floors/{id}",
    operationId: "floorsIdDelete",
    tags: ["Floors"],
    request: { params: FloorIdParam },
    responses: {
      204: { description: "Deleted" },
      404: { description: "Not found" },
    },
  });
}
