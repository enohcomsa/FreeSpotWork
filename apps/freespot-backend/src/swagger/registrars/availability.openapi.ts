import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { RescheduleOptionsQuery, RescheduleOptionsResponse } from "../../schemas/availability.zod";

export function registerAvailability(registry: OpenAPIRegistry) {
  registry.register("RescheduleOptionsQuery", RescheduleOptionsQuery);
  registry.register("RescheduleOptionsResponse", RescheduleOptionsResponse);

  registry.registerPath({
    method: "get",
    path: "/availability/reschedule-options",
    operationId: "availabilityRescheduleOptionsGet",
    tags: ["Availability"],
    request: { query: RescheduleOptionsQuery },
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: RescheduleOptionsResponse } }
      },
      404: { description: "Booking not found" }
    }
  });
}
