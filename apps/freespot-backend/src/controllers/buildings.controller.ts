import type { BuildingIdParamT, BuildingCreateRequest, BuildingUpdateRequest, BuildingResponseDto } from "../schemas/buildings.zod";
import * as svc from "../services/buildings.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, BuildingResponseDto[]>()(async (_req, res) => {
  const data = await svc.getBuildings();
  res.json(data);
});

export const getById = withParams<BuildingIdParamT, BuildingResponseDto>()(async (req, res) => {
  const data = await svc.getBuilding(req.params.id);
  res.json(data);
});

export const create = withBody<BuildingCreateRequest, BuildingResponseDto>()(async (req, res) => {
  const data = await svc.createBuilding(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<BuildingIdParamT, BuildingUpdateRequest, BuildingResponseDto>()(async (req, res) => {
  const data = await svc.updateBuilding(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<BuildingIdParamT, void>()(async (req, res) => {
  await svc.deleteBuilding(req.params.id);
  res.status(204).end();
});
