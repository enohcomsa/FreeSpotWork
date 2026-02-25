import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { CohortCreate, CohortUpdate, CohortResponse, CohortIdParam } from "../../schemas/cohorts.zod";

export function registerCohorts(registry: OpenAPIRegistry) {
  registry.register("CohortResponse", CohortResponse);
  registry.register("CohortCreate", CohortCreate);
  registry.register("CohortUpdate", CohortUpdate);
  registry.register("CohortIdParam", CohortIdParam);

  registry.registerPath({
    method: "get",
    path: "/cohorts",
    operationId: "cohortsGet",
    tags: ["Cohorts"],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": { schema: z.array(CohortResponse) },
        },
      },
      500: { description: "Internal server error" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/cohorts/{id}",
    operationId: "cohortsIdGet",
    tags: ["Cohorts"],
    request: { params: CohortIdParam },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": { schema: CohortResponse },
        },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/cohorts",
    operationId: "cohortsPost",
    tags: ["Cohorts"],
    request: {
      body: {
        content: {
          "application/json": { schema: CohortCreate },
        },
      },
    },
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": { schema: CohortResponse },
        },
      },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/cohorts/{id}",
    operationId: "cohortsIdPatch",
    tags: ["Cohorts"],
    request: {
      params: CohortIdParam,
      body: {
        content: {
          "application/merge-patch+json": { schema: CohortUpdate },
        },
      },
    },
    responses: {
      200: {
        description: "Updated",
        content: {
          "application/json": { schema: CohortResponse },
        },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/cohorts/{id}",
    operationId: "cohortsIdDelete",
    tags: ["Cohorts"],
    request: { params: CohortIdParam },
    responses: {
      204: { description: "Deleted" },
      404: { description: "Not found" },
    },
  });
}
