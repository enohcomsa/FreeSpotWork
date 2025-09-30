import type {
  BuildingCreateInput,
  BuildingUpdateInput,
  BuildingIdParamInput,
  BuildingResponseDto,
} from "../schemas/buildings.zod";
import * as svc from "../services/buildings.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<BuildingIdParamInput, BuildingResponseDto>()(async (req, res) => {
  const data = await svc.getBuilding(req.params.id);
  res.json(data);
});

export const create = withBody<BuildingCreateInput, BuildingResponseDto>()(async (req, res) => {
  const data = await svc.createBuilding(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<BuildingIdParamInput, BuildingUpdateInput, BuildingResponseDto>()(
  async (req, res) => {
    const data = await svc.updateBuilding(req.params.id, req.body);
    res.json(data);
  }
);

export const destroy = withParams<BuildingIdParamInput, void>()(async (req, res) => {
  await svc.deleteBuilding(req.params.id);
  res.status(204).end();
});
