import type {
  FloorCreateInput,
  FloorUpdateInput,
  FloorIdParamInput,
  FloorResponseDto,
} from "../schemas/floors.zod";
import * as svc from "../services/floors.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<FloorIdParamInput, FloorResponseDto>()(async (req, res) => {
  const data = await svc.getFloor(req.params.id);
  res.json(data);
});

export const create = withBody<FloorCreateInput, FloorResponseDto>()(async (req, res) => {
  const data = await svc.createFloor(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<FloorIdParamInput, FloorUpdateInput, FloorResponseDto>()(
  async (req, res) => {
    const data = await svc.updateFloor(req.params.id, req.body);
    res.json(data);
  }
);

export const destroy = withParams<FloorIdParamInput, void>()(async (req, res) => {
  await svc.deleteFloor(req.params.id);
  res.status(204).end();
});
