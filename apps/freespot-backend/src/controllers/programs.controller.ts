import type {
  ProgramCreateInput,
  ProgramUpdateInput,
  ProgramIdParamInput,
  ProgramResponseDto,
} from "../schemas/programs.zod";
import * as svc from "../services/programs.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<ProgramIdParamInput, ProgramResponseDto>()(async (req, res) => {
  const data = await svc.getProgram(req.params.id);
  res.json(data);
});

export const create = withBody<ProgramCreateInput, ProgramResponseDto>()(async (req, res) => {
  const data = await svc.createProgram(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<ProgramIdParamInput, ProgramUpdateInput, ProgramResponseDto>()(
  async (req, res) => {
    const data = await svc.updateProgram(req.params.id, req.body);
    res.json(data);
  }
);

export const destroy = withParams<ProgramIdParamInput, void>()(async (req, res) => {
  await svc.deleteProgram(req.params.id);
  res.status(204).end();
});
