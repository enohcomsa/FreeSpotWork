
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { TimetableActivityCard, TimetableActivityCardIdParam } from "../../schemas/timetable-activities.card.zod";

export function registerTimetableActivityCards(registry: OpenAPIRegistry) {
  registry.register("TimetableActivityCardResponse", TimetableActivityCard);
  registry.register("TimetableActivityCardIdParam", TimetableActivityCardIdParam);

  registry.registerPath({
    method: "get",
    path: "/timetable-activities-cards",
    operationId: "timetableActivityCardsGet",
    tags: ["Timetable Activity Cards"],
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: z.array(TimetableActivityCard) } },
      },
      500: { description: "Internal server error" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/timetable-activities-cards/room/{id}",
    operationId: "getTimetableActivityCardsByRoomId",
    tags: ["Timetable Activity Cards"],
    request: { params: TimetableActivityCardIdParam },
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: z.array(TimetableActivityCard) } },
      },
      500: { description: "Internal server error" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/timetable-activities-cards/{id}",
    operationId: "timetableActivityCardsIdGet",
    tags: ["Timetable Activity Cards"],
    request: { params: TimetableActivityCardIdParam },
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: TimetableActivityCard } },
      },
      404: { description: "Not found" },
    },
  });
}
