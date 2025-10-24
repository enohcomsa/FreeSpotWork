import type { FacultyIdParamT, FacultyCreateRequest, FacultyUpdateRequest, FacultyResponseDto } from "../schemas/faculties.zod";
import * as svc from "../services/faculties.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, FacultyResponseDto[]>()(async (_req, res) => {
  const data = await svc.getFaculties();
  res.json(data);
});

export const getById = withParams<FacultyIdParamT, FacultyResponseDto>()(async (req, res) => {
  const data = await svc.getFaculty(req.params.id);
  res.json(data);
});

export const create = withBody<FacultyCreateRequest, FacultyResponseDto>()(async (req, res) => {
  const data = await svc.createFaculty(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<FacultyIdParamT, FacultyUpdateRequest, FacultyResponseDto>()(async (req, res) => {
  const data = await svc.updateFaculty(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<FacultyIdParamT, void>()(async (req, res) => {
  await svc.deleteFaculty(req.params.id);
  res.status(204).end();
});
