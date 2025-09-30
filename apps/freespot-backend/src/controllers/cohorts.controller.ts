import type {
  CohortCreateInput,
  CohortUpdateInput,
  CohortIdParamInput,
  CohortResponseDto,
} from "../schemas/cohorts.zod";
import * as svc from "../services/cohorts.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<CohortIdParamInput, CohortResponseDto>()(async (req, res) => {
  const data = await svc.getCohort(req.params.id);
  res.json(data);
});

export const create = withBody<CohortCreateInput, CohortResponseDto>()(async (req, res) => {
  const data = await svc.createCohort(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<CohortIdParamInput, CohortUpdateInput, CohortResponseDto>()(
  async (req, res) => {
    const data = await svc.updateCohort(req.params.id, req.body);
    res.json(data);
  }
);

export const destroy = withParams<CohortIdParamInput, void>()(async (req, res) => {
  await svc.deleteCohort(req.params.id);
  res.status(204).end();
});
