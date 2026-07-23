import type { BuildingIdParamT, BuildingCreateRequest, BuildingUpdateRequest, BuildingResponseDto } from "../schemas/buildings.zod";
import * as svc from "../services/buildings.service";
import { withAuthenticatedParams, withAuthenticatedBody, withAuthenticatedParamsAndBody, withAuthenticatedRequest } from "../utils/async-handler";

export const list = withAuthenticatedRequest<BuildingResponseDto[]>()(async (_req, res) => {
  const data = await svc.getBuildings();
  res.json(data);
});

export const getById = withAuthenticatedParams<BuildingIdParamT, BuildingResponseDto>()(async (req, res) => {
  const data = await svc.getBuilding(req.params.id);
  res.json(data);
});

export const create = withAuthenticatedBody<BuildingCreateRequest, BuildingResponseDto>()(async (req, res) => {
  const data = await svc.createBuilding(req.body);
  res.status(201).json(data);
});

export const update = withAuthenticatedParamsAndBody<BuildingIdParamT, BuildingUpdateRequest, BuildingResponseDto>()(async (req, res) => {
  const data = await svc.updateBuilding(req.params.id, req.body);
  res.json(data);
});

export const destroy = withAuthenticatedParams<BuildingIdParamT, void>()(async (req, res) => {
  await svc.deleteBuilding(req.params.id);
  res.status(204).end();
});
