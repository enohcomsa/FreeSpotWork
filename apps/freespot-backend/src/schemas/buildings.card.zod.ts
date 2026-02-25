import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr } from "./common.zod";
import { strictObj } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const BuildingCardFloor = strictObj({
  name: z.string(),
  total: z.number().int().nonnegative(),
  unavailable: z.number().int().nonnegative(),
}).openapi("BuildingCardFloor");

export const BuildingCard = strictObj({
  id: ObjectIdStr,
  name: z.string(),
  address: z.string(),
  floors: z.array(BuildingCardFloor),
}).openapi("BuildingCard");
export const BuildingCardIdParam = strictObj({ id: ObjectIdStr }).openapi("BuildingCardIdParam");

export type BuildingCardDto = z.infer<typeof BuildingCard>;
export type BuildingCardFloorDto = z.infer<typeof BuildingCardFloor>;
export type BuildingCardIdParamT = z.infer<typeof BuildingCardIdParam>;
