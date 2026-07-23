import type { SubjectIdParamT, SubjectCreateRequest, SubjectUpdateRequest, SubjectResponseDto } from "../schemas/subjects.zod";
import * as svc from "../services/subjects.service";
import { withAuthenticatedParams, withAuthenticatedBody, withAuthenticatedParamsAndBody, withAuthenticatedRequest } from "../utils/async-handler";

export const list = withAuthenticatedRequest<SubjectResponseDto[]>()(async (_req, res) => {
  const data = await svc.getSubjects();
  res.json(data);
});

export const getById = withAuthenticatedParams<SubjectIdParamT, SubjectResponseDto>()(async (req, res) => {
  const data = await svc.getSubject(req.params.id);
  res.json(data);
});

export const create = withAuthenticatedBody<SubjectCreateRequest, SubjectResponseDto>()(async (req, res) => {
  const data = await svc.createSubject(req.body);
  res.status(201).json(data);
});

export const update = withAuthenticatedParamsAndBody<SubjectIdParamT, SubjectUpdateRequest, SubjectResponseDto>()(async (req, res) => {
  const data = await svc.updateSubject(req.params.id, req.body);
  res.json(data);
});

export const destroy = withAuthenticatedParams<SubjectIdParamT, void>()(async (req, res) => {
  await svc.deleteSubject(req.params.id);
  res.status(204).end();
});
