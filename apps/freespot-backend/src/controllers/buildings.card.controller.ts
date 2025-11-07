import { BuildingCardDto, BuildingCardIdParamT } from "../schemas/buildings.card.zod";
import * as svc from "../services/buildings.card.service";
import { withParams, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, BuildingCardDto[]>()(async (_req, res) => {
  const data = await svc.listBuildingCards();
  res.json(data);
});

export const getById = withParams<BuildingCardIdParamT, BuildingCardDto>()(async (req, res) => {
  const data = await svc.getBuildingCard(req.params.id);
  res.json(data);
});
