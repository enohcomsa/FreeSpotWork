import type {
  BookingCreateInput,
  BookingUpdateInput,
  BookingIdParamInput,
  BookingResponseDto,
} from "../schemas/bookings.zod";
import * as svc from "../services/bookings.service";
import { withParams, withBody, withParamsAndBody } from "../utils/async-handler";

export const getById = withParams<BookingIdParamInput, BookingResponseDto>()(async (req, res) => {
  const data = await svc.getBooking(req.params.id);
  res.json(data);
});

export const create = withBody<BookingCreateInput, BookingResponseDto>()(async (req, res) => {
  const data = await svc.createBooking(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<BookingIdParamInput, BookingUpdateInput, BookingResponseDto>()(
  async (req, res) => {
    const data = await svc.updateBooking(req.params.id, req.body);
    res.json(data);
  }
);

export const destroy = withParams<BookingIdParamInput, void>()(async (req, res) => {
  await svc.deleteBooking(req.params.id);
  res.status(204).end();
});
