import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  FacultyCreate,
  FacultyUpdate,
  FacultyResponse,
  FacultyIdParam,
} from "../../schemas/faculties.zod";

export function registerFaculties(registry: OpenAPIRegistry) {
  registry.register("FacultyResponse", FacultyResponse);
  registry.register("FacultyCreate", FacultyCreate);
  registry.register("FacultyUpdate", FacultyUpdate);
  registry.register("FacultyIdParam", FacultyIdParam);

  registry.registerPath({
    method: "get",
    path: "/faculties",
    operationId: "facultiesGet",
    tags: ["Faculties"],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": { schema: z.array(FacultyResponse) },
        },
      },
      500: { description: "Internal server error" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/faculties/{id}",
    operationId: "facultiesIdGet",
    tags: ["Faculties"],
    request: { params: FacultyIdParam },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": { schema: FacultyResponse },
        },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/faculties",
    operationId: "facultiesPost",
    tags: ["Faculties"],
    request: {
      body: {
        content: {
          "application/json": { schema: FacultyCreate },
        },
      },
    },
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": { schema: FacultyResponse },
        },
      },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/faculties/{id}",
    operationId: "facultiesIdPatch",
    tags: ["Faculties"],
    request: {
      params: FacultyIdParam,
      body: {
        content: {
          "application/merge-patch+json": { schema: FacultyUpdate },
        },
      },
    },
    responses: {
      200: {
        description: "Updated",
        content: {
          "application/json": { schema: FacultyResponse },
        },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/faculties/{id}",
    operationId: "facultiesIdDelete",
    tags: ["Faculties"],
    request: { params: FacultyIdParam },
    responses: {
      204: { description: "Deleted" },
      404: { description: "Not found" },
    },
  });
}
