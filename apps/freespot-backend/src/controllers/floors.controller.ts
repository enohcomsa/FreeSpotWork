import type { FloorIdParamT, FloorCreateRequest, FloorUpdateRequest, FloorResponseDto } from "../schemas/floors.zod";
import * as svc from "../services/floors.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, FloorResponseDto[]>()(async (_req, res) => {
  const data = await svc.getFloors();
  res.json(data);
});

export const getById = withParams<FloorIdParamT, FloorResponseDto>()(async (req, res) => {
  const data = await svc.getFloor(req.params.id);
  res.json(data);
});

export const create = withBody<FloorCreateRequest, FloorResponseDto>()(async (req, res) => {
  const data = await svc.createFloor(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<FloorIdParamT, FloorUpdateRequest, FloorResponseDto>()(async (req, res) => {
  const data = await svc.updateFloor(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<FloorIdParamT, void>()(async (req, res) => {
  await svc.deleteFloor(req.params.id);
  res.status(204).end();
});
