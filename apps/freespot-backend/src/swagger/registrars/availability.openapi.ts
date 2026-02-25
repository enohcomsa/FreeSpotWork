import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { AvailabilityQuery, AvailabilityResponse } from "../../schemas/availability.zod";

export function registerAvailability(registry: OpenAPIRegistry) {
  registry.register("AvailabilityQuery", AvailabilityQuery);
  registry.register("AvailabilityResponse", AvailabilityResponse);

  registry.registerPath({
    method: "get",
    path: "/availability",
    operationId: "availabilityGet",
    tags: ["Availability"],
    request: { query: AvailabilityQuery },
    responses: {
      200: { description: "OK", content: { "application/json": { schema: AvailabilityResponse } } }
    }
  });
}
