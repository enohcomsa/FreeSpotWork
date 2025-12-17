import * as repo from "../repos/buildings.card.repo";
import { NotFoundError } from "./errors";
import { BuildingCardDto } from "../schemas/buildings.card.zod";

export async function listBuildingCards(): Promise<BuildingCardDto[]> {
  return repo.listBuildingCards();
}

export async function getBuildingCard(id: string): Promise<BuildingCardDto> {
  const res = await repo.getBuildingCard(id);
  if (!res) throw new NotFoundError("Building not found");
  return res;
}
