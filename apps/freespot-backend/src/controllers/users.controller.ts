import type { UserIdParamT, UserMeProfileUpdateRequest, UserUpdateRequest, UserResponseDto, UserMePreferencesUpdateRequest } from "../schemas/users.zod";
import * as svc from "../services/users.service";
import { withAuthenticatedBody, withAuthenticatedParams, withAuthenticatedParamsAndBody, withAuthenticatedRequest } from "../utils/async-handler";

export const list = withAuthenticatedRequest<UserResponseDto[]>()(async (_req, res) => {
  const data = await svc.getUsers();
  res.json(data);
});

export const getById = withAuthenticatedParams<UserIdParamT, UserResponseDto>()(async (req, res) => {
  const data = await svc.getUser(req.params.id);
  res.json(data);
});

export const patchMyProfile = withAuthenticatedBody<UserMeProfileUpdateRequest, UserResponseDto>()(async (req, res) => {
  const data = await svc.updateMyProfile(req, req.body);
  res.json(data);
});

export const patchMyPreferences = withAuthenticatedBody<UserMePreferencesUpdateRequest, UserResponseDto>()(async (req, res) => {
  const data = await svc.updateMyPreferences(req, req.body);
  res.json(data);
});

export const update = withAuthenticatedParamsAndBody<UserIdParamT, UserUpdateRequest, UserResponseDto>()(async (req, res) => {
  const data = await svc.updateUser(req.params.id, req.body);
  res.json(data);
});

export const destroy = withAuthenticatedParams<UserIdParamT, void>()(async (req, res) => {
  await svc.deleteUser(req.params.id);
  res.status(204).end();
});
