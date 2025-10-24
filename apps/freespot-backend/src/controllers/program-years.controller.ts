import type { ProgramYearIdParamT, ProgramYearCreateRequest, ProgramYearUpdateRequest, ProgramYearResponseDto } from "../schemas/program-years.zod";
import * as svc from "../services/program-years.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, ProgramYearResponseDto[]>()(async (_req, res) => {
  const data = await svc.getProgramYears();
  res.json(data);
});

export const getById = withParams<ProgramYearIdParamT, ProgramYearResponseDto>()(async (req, res) => {
  const data = await svc.getProgramYear(req.params.id);
  res.json(data);
});

export const create = withBody<ProgramYearCreateRequest, ProgramYearResponseDto>()(async (req, res) => {
  const data = await svc.createProgramYear(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<ProgramYearIdParamT, ProgramYearUpdateRequest, ProgramYearResponseDto>()(async (req, res) => {
  const data = await svc.updateProgramYear(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<ProgramYearIdParamT, void>()(async (req, res) => {
  await svc.deleteProgramYear(req.params.id);
  res.status(204).end();
});
