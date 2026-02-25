import type { UserIdParamT, UserCreateRequest, UserUpdateRequest, UserResponseDto } from "../schemas/users.zod";
import * as svc from "../services/users.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, UserResponseDto[]>()(async (_req, res) => {
  const data = await svc.getUsers();
  res.json(data);
});

export const getById = withParams<UserIdParamT, UserResponseDto>()(async (req, res) => {
  const data = await svc.getUser(req.params.id);
  res.json(data);
});

export const create = withBody<UserCreateRequest, UserResponseDto>()(async (req, res) => {
  const data = await svc.createUser(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<UserIdParamT, UserUpdateRequest, UserResponseDto>()(async (req, res) => {
  const data = await svc.updateUser(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<UserIdParamT, void>()(async (req, res) => {
  await svc.deleteUser(req.params.id);
  res.status(204).end();
});
