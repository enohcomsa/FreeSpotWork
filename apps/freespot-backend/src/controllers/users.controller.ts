import type {
  UserCreateInput,
  UserUpdateInput,
  UserIdParamInput,
  UserResponseDto,
} from "../schemas/users.zod";
import * as svc from "../services/users.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<UserIdParamInput, UserResponseDto>()(async (req, res) => {
  const data = await svc.getUser(req.params.id);
  res.json(data);
});

export const create = withBody<UserCreateInput, UserResponseDto>()(async (req, res) => {
  const data = await svc.createUser(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<UserIdParamInput, UserUpdateInput, UserResponseDto>()(
  async (req, res) => {
    const data = await svc.updateUser(req.params.id, req.body);
    res.json(data);
  }
);

export const destroy = withParams<UserIdParamInput, void>()(async (req, res) => {
  await svc.deleteUser(req.params.id);
  res.status(204).end();
});
