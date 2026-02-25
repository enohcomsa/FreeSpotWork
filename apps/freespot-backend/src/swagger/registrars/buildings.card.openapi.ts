
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { BuildingCard, BuildingCardIdParam } from "../../schemas/buildings.card.zod";

export function registerBuildingsCards(registry: OpenAPIRegistry) {
  registry.register("BuildingsCardResponse", BuildingCard);
  registry.register("BuildingCardIdParam", BuildingCardIdParam);

  registry.registerPath({
    method: "get",
    path: "/buildings-cards",
    operationId: "buildingsCardsGet",
    tags: ["Buildings Cards"],
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: z.array(BuildingCard) } },
      },
      500: { description: "Internal server error" },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/buildings-cards/{id}",
    operationId: "buildingsCardsIdGet",
    tags: ["Buildings Cards"],
    request: { params: BuildingCardIdParam },
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: BuildingCard } },
      },
      404: { description: "Not found" },
    },
  });
}
