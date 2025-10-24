import type { BookingIdParamT, BookingCreateRequest, BookingUpdateRequest, BookingResponseDto } from "../schemas/bookings.zod";
import * as svc from "../services/bookings.service";
import { withParams, withBody, withParamsAndBody, withQuery } from "../utils/async-handler";

export const list = withQuery<unknown, BookingResponseDto[]>()(async (_req, res) => {
  const data = await svc.getBookings();
  res.json(data);
});

export const getById = withParams<BookingIdParamT, BookingResponseDto>()(async (req, res) => {
  const data = await svc.getBooking(req.params.id);
  res.json(data);
});

export const create = withBody<BookingCreateRequest, BookingResponseDto>()(async (req, res) => {
  const data = await svc.createBooking(req.body);
  res.status(201).json(data);
});

export const update = withParamsAndBody<BookingIdParamT, BookingUpdateRequest, BookingResponseDto>()(async (req, res) => {
  const data = await svc.updateBooking(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<BookingIdParamT, void>()(async (req, res) => {
  await svc.deleteBooking(req.params.id);
  res.status(204).end();
});
