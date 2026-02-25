import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { BookingCreate, BookingUpdate, BookingResponse, BookingIdParam } from "../../schemas/bookings.zod";

export function registerBookings(registry: OpenAPIRegistry) {
  registry.register("BookingResponse", BookingResponse);
  registry.register("BookingCreate", BookingCreate);
  registry.register("BookingUpdate", BookingUpdate);
  registry.register("BookingIdParam", BookingIdParam);

  registry.registerPath({ method: "get", path: "/bookings/{id}", operationId: "bookingsIdGet", tags: ["Bookings"], request: { params: BookingIdParam }, responses: { 200: { description: "OK", content: { "application/json": { schema: BookingResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "post", path: "/bookings", operationId: "bookingsPost", tags: ["Bookings"], request: { body: { content: { "application/json": { schema: BookingCreate } } } }, responses: { 201: { description: "Created", content: { "application/json": { schema: BookingResponse } } }, 409: { description: "Duplicate key" } } });
  registry.registerPath({ method: "patch", path: "/bookings/{id}", operationId: "bookingsIdPatch", tags: ["Bookings"], request: { params: BookingIdParam, body: { content: { "application/merge-patch+json": { schema: BookingUpdate } } } }, responses: { 200: { description: "Updated", content: { "application/json": { schema: BookingResponse } } }, 404: { description: "Not found" } } });
  registry.registerPath({ method: "delete", path: "/bookings/{id}", operationId: "bookingsIdDelete", tags: ["Bookings"], request: { params: BookingIdParam }, responses: { 204: { description: "Deleted" }, 404: { description: "Not found" } } });
}
