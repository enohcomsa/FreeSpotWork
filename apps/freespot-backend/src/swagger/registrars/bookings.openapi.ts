import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  BookingCreate,
  BookingUpdate,
  BookingReschedule,
  BookingResponse,
  BookingIdParam,
  BookingUserIdParam
} from "../../schemas/bookings.zod";

export function registerBookings(registry: OpenAPIRegistry) {
  registry.register("BookingResponse", BookingResponse);
  registry.register("BookingResponseList", z.array(BookingResponse));
  registry.register("BookingCreate", BookingCreate);
  registry.register("BookingUpdate", BookingUpdate);
  registry.register("BookingReschedule", BookingReschedule);
  registry.register("BookingIdParam", BookingIdParam);
  registry.register("BookingUserIdParam", BookingUserIdParam);

  registry.registerPath({
    method: "get",
    path: "/bookings",
    operationId: "bookingsGet",
    tags: ["Bookings"],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: z.array(BookingResponse),
          },
        },
      },
      401: { description: "Unauthenticated" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/bookings/admin/user/{userId}",
    operationId: "bookingsAdminUserIdGet",
    tags: ["Bookings"],
    request: {
      params: BookingUserIdParam,
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: z.array(BookingResponse),
          },
        },
      },
      401: { description: "Unauthenticated" },
      403: { description: "Forbidden" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/bookings/{id}",
    operationId: "bookingsIdGet",
    tags: ["Bookings"],
    request: { params: BookingIdParam },
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: BookingResponse } },
      },
      401: { description: "Unauthenticated" },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/bookings",
    operationId: "bookingsPost",
    tags: ["Bookings"],
    request: {
      body: {
        content: {
          "application/json": { schema: BookingCreate },
        },
      },
    },
    responses: {
      201: {
        description: "Created",
        content: { "application/json": { schema: BookingResponse } },
      },
      401: { description: "Unauthenticated" },
      409: { description: "Duplicate key" },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/bookings/{id}",
    operationId: "bookingsIdPatch",
    tags: ["Bookings"],
    request: {
      params: BookingIdParam,
      body: {
        content: {
          "application/merge-patch+json": { schema: BookingReschedule },
        },
      },
    },
    responses: {
      200: {
        description: "Updated",
        content: { "application/json": { schema: BookingResponse } },
      },
      401: { description: "Unauthenticated" },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/bookings/{id}/admin",
    operationId: "bookingsIdAdminPatch",
    tags: ["Bookings"],
    request: {
      params: BookingIdParam,
      body: {
        content: {
          "application/merge-patch+json": { schema: BookingUpdate },
        },
      },
    },
    responses: {
      200: {
        description: "Updated",
        content: { "application/json": { schema: BookingResponse } },
      },
      401: { description: "Unauthenticated" },
      403: { description: "Forbidden" },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/bookings/{id}",
    operationId: "bookingsIdDelete",
    tags: ["Bookings"],
    request: { params: BookingIdParam },
    responses: {
      204: { description: "Deleted" },
      401: { description: "Unauthenticated" },
      404: { description: "Not found" },
    },
  });
}
