import type {
  RoomCreateInput,
  RoomUpdateInput,
  RoomIdParamInput,
  RoomResponseDto,
} from "../schemas/rooms.zod";
import * as svc from "../services/rooms.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<RoomIdParamInput, RoomResponseDto>()(async (req, res) => {
  const data = await svc.getRoom(req.params.id);
  res.json(data);
});

export const create = withBody<RoomCreateInput, RoomResponseDto>()(async (req, res) => {
  const data = await svc.createRoom(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<RoomIdParamInput, RoomUpdateInput, RoomResponseDto>()(
  async (req, res) => {
    const data = await svc.updateRoom(req.params.id, req.body);
    res.json(data);
  }
);

export const destroy = withParams<RoomIdParamInput, void>()(async (req, res) => {
  await svc.deleteRoom(req.params.id);
  res.status(204).end();
});
