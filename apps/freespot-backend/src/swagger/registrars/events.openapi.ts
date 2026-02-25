import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  EventCreate,
  EventUpdate,
  EventResponse,
  EventIdParam,
} from "../../schemas/events.zod";

export function registerEvents(registry: OpenAPIRegistry) {
  registry.register("EventResponse", EventResponse);
  registry.register("EventCreate", EventCreate);
  registry.register("EventUpdate", EventUpdate);
  registry.register("EventIdParam", EventIdParam);

  registry.registerPath({
    method: "get",
    path: "/events",
    operationId: "eventsGet",
    tags: ["Events"],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": { schema: z.array(EventResponse) },
        },
      },
      500: { description: "Internal server error" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/events/{id}",
    operationId: "eventsIdGet",
    tags: ["Events"],
    request: { params: EventIdParam },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": { schema: EventResponse },
        },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/events",
    operationId: "eventsPost",
    tags: ["Events"],
    request: {
      body: {
        content: {
          "application/json": { schema: EventCreate },
        },
      },
    },
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": { schema: EventResponse },
        },
      },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/events/{id}",
    operationId: "eventsIdPatch",
    tags: ["Events"],
    request: {
      params: EventIdParam,
      body: {
        content: {
          "application/merge-patch+json": { schema: EventUpdate },
        },
      },
    },
    responses: {
      200: {
        description: "Updated",
        content: {
          "application/json": { schema: EventResponse },
        },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/events/{id}",
    operationId: "eventsIdDelete",
    tags: ["Events"],
    request: { params: EventIdParam },
    responses: {
      204: { description: "Deleted" },
      404: { description: "Not found" },
    },
  });
}
