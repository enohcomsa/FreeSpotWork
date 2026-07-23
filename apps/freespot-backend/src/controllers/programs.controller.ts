import type { ProgramIdParamT, ProgramCreateRequest, ProgramUpdateRequest, ProgramResponseDto } from "../schemas/programs.zod";
import * as svc from "../services/programs.service";
import { withAuthenticatedParams, withAuthenticatedBody, withAuthenticatedParamsAndBody, withAuthenticatedRequest } from "../utils/async-handler";

export const list = withAuthenticatedRequest<ProgramResponseDto[]>()(async (_req, res) => {
  const data = await svc.getPrograms();
  res.json(data);
});

export const getById = withAuthenticatedParams<ProgramIdParamT, ProgramResponseDto>()(async (req, res) => {
  const data = await svc.getProgram(req.params.id);
  res.json(data);
});

export const create = withAuthenticatedBody<ProgramCreateRequest, ProgramResponseDto>()(async (req, res) => {
  const data = await svc.createProgram(req.body);
  res.status(201).json(data);
});

export const update = withAuthenticatedParamsAndBody<ProgramIdParamT, ProgramUpdateRequest, ProgramResponseDto>()(async (req, res) => {
  const data = await svc.updateProgram(req.params.id, req.body);
  res.json(data);
});

export const destroy = withAuthenticatedParams<ProgramIdParamT, void>()(async (req, res) => {
  await svc.deleteProgram(req.params.id);
  res.status(204).end();
});
