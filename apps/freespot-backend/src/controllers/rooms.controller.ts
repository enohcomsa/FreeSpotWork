import type { RoomIdParamT, RoomCreateRequest, RoomUpdateRequest, RoomResponseDto } from "../schemas/rooms.zod";
import * as svc from "../services/rooms.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, RoomResponseDto[]>()(async (_req, res) => {
  const data = await svc.getRooms();
  res.json(data);
});

export const getById = withParams<RoomIdParamT, RoomResponseDto>()(async (req, res) => {
  const data = await svc.getRoom(req.params.id);
  res.json(data);
});

export const create = withBody<RoomCreateRequest, RoomResponseDto>()(async (req, res) => {
  const data = await svc.createRoom(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<RoomIdParamT, RoomUpdateRequest, RoomResponseDto>()(async (req, res) => {
  const data = await svc.updateRoom(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<RoomIdParamT, void>()(async (req, res) => {
  await svc.deleteRoom(req.params.id);
  res.status(204).end();
});
