import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  RoomCreate_OA,
  RoomUpdate_OA,
  RoomResponse_OA,
  RoomIdParam,
} from "../../schemas/rooms.zod";
import { z } from "zod";

export function registerRooms(registry: OpenAPIRegistry) {
  registry.register("RoomResponse", RoomResponse_OA);
  registry.register("RoomCreate", RoomCreate_OA);
  registry.register("RoomUpdate", RoomUpdate_OA);
  registry.register("RoomIdParam", RoomIdParam);

  registry.registerPath({
    method: "get",
    path: "/rooms",
    operationId: "roomsGet",
    tags: ["Rooms"],
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: z.array(RoomResponse_OA) } },
      },
      500: { description: "Internal server error" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/rooms/{id}",
    operationId: "roomsIdGet",
    tags: ["Rooms"],
    request: { params: RoomIdParam },
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: RoomResponse_OA } },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/rooms",
    operationId: "roomsPost",
    tags: ["Rooms"],
    request: {
      body: {
        content: { "application/json": { schema: RoomCreate_OA } },
      },
    },
    responses: {
      201: {
        description: "Created",
        content: { "application/json": { schema: RoomResponse_OA } },
      },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/rooms/{id}",
    operationId: "roomsIdPatch",
    tags: ["Rooms"],
    request: {
      params: RoomIdParam,
      body: {
        content: {
          "application/merge-patch+json": { schema: RoomUpdate_OA },
        },
      },
    },
    responses: {
      200: {
        description: "Updated",
        content: { "application/json": { schema: RoomResponse_OA } },
      },
      404: { description: "Not found" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/rooms/{id}",
    operationId: "roomsIdDelete",
    tags: ["Rooms"],
    request: { params: RoomIdParam },
    responses: {
      204: { description: "Deleted" },
      404: { description: "Not found" },
    },
  });
}
