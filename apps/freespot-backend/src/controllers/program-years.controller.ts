import type {
  ProgramYearCreateInput,
  ProgramYearUpdateInput,
  ProgramYearIdParamInput,
  ProgramYearResponseDto,
} from "../schemas/program-years.zod";
import * as svc from "../services/program-years.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<ProgramYearIdParamInput, ProgramYearResponseDto>()(async (req, res) => {
  const data = await svc.getProgramYear(req.params.id);
  res.json(data);
});

export const create = withBody<ProgramYearCreateInput, ProgramYearResponseDto>()(async (req, res) => {
  const data = await svc.createProgramYear(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<ProgramYearIdParamInput, ProgramYearUpdateInput, ProgramYearResponseDto>()(
  async (req, res) => {
    const data = await svc.updateProgramYear(req.params.id, req.body);
    res.json(data);
  }
);

export const destroy = withParams<ProgramYearIdParamInput, void>()(async (req, res) => {
  await svc.deleteProgramYear(req.params.id);
  res.status(204).end();
});
