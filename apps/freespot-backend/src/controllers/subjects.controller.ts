import type {
  SubjectCreateInput,
  SubjectUpdateInput,
  SubjectIdParamInput,
  SubjectResponseDto,
} from "../schemas/subjects.zod";
import * as svc from "../services/subjects.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<SubjectIdParamInput, SubjectResponseDto>()(async (req, res) => {
  const data = await svc.getSubject(req.params.id);
  res.json(data);
});

export const create = withBody<SubjectCreateInput, SubjectResponseDto>()(async (req, res) => {
  const data = await svc.createSubject(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<SubjectIdParamInput, SubjectUpdateInput, SubjectResponseDto>()(
  async (req, res) => {
    const data = await svc.updateSubject(req.params.id, req.body);
    res.json(data);
  }
);

export const destroy = withParams<SubjectIdParamInput, void>()(async (req, res) => {
  await svc.deleteSubject(req.params.id);
  res.status(204).end();
});
