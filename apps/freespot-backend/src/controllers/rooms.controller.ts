import type { RoomIdParamT, RoomCreateRequest, RoomUpdateRequest, RoomResponseDto } from "../schemas/rooms.zod";
import * as svc from "../services/rooms.service";
import { withAuthenticatedParams, withAuthenticatedBody, withAuthenticatedParamsAndBody, withAuthenticatedRequest } from "../utils/async-handler";

export const list = withAuthenticatedRequest<RoomResponseDto[]>()(async (_req, res) => {
  const data = await svc.getRooms();
  res.json(data);
});

export const getById = withAuthenticatedParams<RoomIdParamT, RoomResponseDto>()(async (req, res) => {
  const data = await svc.getRoom(req.params.id);
  res.json(data);
});

export const create = withAuthenticatedBody<RoomCreateRequest, RoomResponseDto>()(async (req, res) => {
  const data = await svc.createRoom(req.body);
  res.status(201).json(data);
});

export const update = withAuthenticatedParamsAndBody<RoomIdParamT, RoomUpdateRequest, RoomResponseDto>()(async (req, res) => {
  const data = await svc.updateRoom(req.params.id, req.body);
  res.json(data);
});

export const destroy = withAuthenticatedParams<RoomIdParamT, void>()(async (req, res) => {
  await svc.deleteRoom(req.params.id);
  res.status(204).end();
});
