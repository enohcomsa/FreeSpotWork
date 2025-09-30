import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { RoomCreate, RoomUpdate, RoomResponse, RoomIdParam } from "../../schemas/rooms.zod";

export function registerRooms(registry: OpenAPIRegistry) {
  registry.register("RoomResponse", RoomResponse);
  registry.register("RoomCreate", RoomCreate);
  registry.register("RoomUpdate", RoomUpdate);

  registry.registerPath({ method: "get", path: "/rooms/{id}", tags: ["Rooms"], request: { params: RoomIdParam }, responses: { 200: { description: "OK", content: { "application/json": { schema: RoomResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "post", path: "/rooms", tags: ["Rooms"], request: { body: { content: { "application/json": { schema: RoomCreate } } } }, responses: { 201: { description: "Created", content: { "application/json": { schema: RoomResponse } } } } });
  registry.registerPath({ method: "patch", path: "/rooms/{id}", tags: ["Rooms"], request: { params: RoomIdParam, body: { content: { "application/json": { schema: RoomUpdate } } } }, responses: { 200: { description: "Updated", content: { "application/json": { schema: RoomResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "delete", path: "/rooms/{id}", tags: ["Rooms"], request: { params: RoomIdParam }, responses: { 204: { description: "Deleted" }, 404: { description: "Not found" } } });
}
