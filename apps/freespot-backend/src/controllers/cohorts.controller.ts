import type { CohortIdParamT, CohortCreateRequest, CohortUpdateRequest, CohortResponseDto } from "../schemas/cohorts.zod";
import * as svc from "../services/cohorts.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, CohortResponseDto[]>()(async (_req, res) => {
  const data = await svc.getCohorts();
  res.json(data);
});

export const getById = withParams<CohortIdParamT, CohortResponseDto>()(async (req, res) => {
  const data = await svc.getCohort(req.params.id);
  res.json(data);
});

export const create = withBody<CohortCreateRequest, CohortResponseDto>()(async (req, res) => {
  const data = await svc.createCohort(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<CohortIdParamT, CohortUpdateRequest, CohortResponseDto>()(async (req, res) => {
  const data = await svc.updateCohort(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<CohortIdParamT, void>()(async (req, res) => {
  await svc.deleteCohort(req.params.id);
  res.status(204).end();
});
