import type { ProgramIdParamT, ProgramCreateRequest, ProgramUpdateRequest, ProgramResponseDto } from "../schemas/programs.zod";
import * as svc from "../services/programs.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, ProgramResponseDto[]>()(async (_req, res) => {
  const data = await svc.getPrograms();
  res.json(data);
});

export const getById = withParams<ProgramIdParamT, ProgramResponseDto>()(async (req, res) => {
  const data = await svc.getProgram(req.params.id);
  res.json(data);
});

export const create = withBody<ProgramCreateRequest, ProgramResponseDto>()(async (req, res) => {
  const data = await svc.createProgram(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<ProgramIdParamT, ProgramUpdateRequest, ProgramResponseDto>()(async (req, res) => {
  const data = await svc.updateProgram(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<ProgramIdParamT, void>()(async (req, res) => {
  await svc.deleteProgram(req.params.id);
  res.status(204).end();
});
