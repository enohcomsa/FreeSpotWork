import type { SubjectIdParamT, SubjectCreateRequest, SubjectUpdateRequest, SubjectResponseDto } from "../schemas/subjects.zod";
import * as svc from "../services/subjects.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, SubjectResponseDto[]>()(async (_req, res) => {
  const data = await svc.getSubjects();
  res.json(data);
});

export const getById = withParams<SubjectIdParamT, SubjectResponseDto>()(async (req, res) => {
  const data = await svc.getSubject(req.params.id);
  res.json(data);
});

export const create = withBody<SubjectCreateRequest, SubjectResponseDto>()(async (req, res) => {
  const data = await svc.createSubject(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<SubjectIdParamT, SubjectUpdateRequest, SubjectResponseDto>()(async (req, res) => {
  const data = await svc.updateSubject(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<SubjectIdParamT, void>()(async (req, res) => {
  await svc.deleteSubject(req.params.id);
  res.status(204).end();
});
