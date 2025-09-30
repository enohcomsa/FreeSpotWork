import type {
  FacultyCreateInput,
  FacultyUpdateInput,
  FacultyIdParamInput,
  FacultyResponseDto,
} from "../schemas/faculties.zod";
import * as svc from "../services/faculties.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<FacultyIdParamInput, FacultyResponseDto>()(async (req, res) => {
  const data = await svc.getFaculty(req.params.id);
  res.json(data);
});

export const create = withBody<FacultyCreateInput, FacultyResponseDto>()(async (req, res) => {
  const data = await svc.createFaculty(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<FacultyIdParamInput, FacultyUpdateInput, FacultyResponseDto>()(
  async (req, res) => {
    const data = await svc.updateFaculty(req.params.id, req.body);
    res.json(data);
  }
);

export const destroy = withParams<FacultyIdParamInput, void>()(async (req, res) => {
  await svc.deleteFaculty(req.params.id);
  res.status(204).end();
});
