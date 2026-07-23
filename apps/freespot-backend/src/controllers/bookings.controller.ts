import type {
  BookingCreateRequest,
  BookingIdParamT,
  BookingUserIdParamT,
  BookingRescheduleRequest,
  BookingUpdateRequest,
  BookingResponseDto
} from "../schemas/bookings.zod";
import * as svc from "../services/bookings.service";
import {  withAuthenticatedParamsAndBody, withAuthenticatedRequest, withAuthenticatedParams } from "../utils/async-handler";

export const listMine = withAuthenticatedRequest<BookingResponseDto[]>()(async (req, res) => {
  const data = await svc.getMyBookings(req.user.sub);
  res.json(data);
});

export const listByUserIdAdmin = withAuthenticatedParams<BookingUserIdParamT, BookingResponseDto[]>()(async (req, res) => {
  const data = await svc.getBookingsByUserIdForAdmin(req.params.userId);
  res.json(data);
});

export const getById = withAuthenticatedParams<BookingIdParamT, BookingResponseDto>()(async (req, res) => {
  const data = await svc.getMyBooking(req.params.id, req?.user?.sub);
  res.json(data);
});

export const create = withAuthenticatedParamsAndBody<Record<string, never>, BookingCreateRequest, BookingResponseDto>()(async (req, res) => {
  const data = await svc.createBooking(req?.user?.sub, req.body);
  res.status(201).json(data);
});

export const reschedule = withAuthenticatedParamsAndBody<BookingIdParamT, BookingRescheduleRequest, BookingResponseDto>()(async (req, res) => {
  const data = await svc.rescheduleMyBooking(req.params.id, req?.user?.sub, req.body);
  res.json(data);
});

export const update = withAuthenticatedParamsAndBody<BookingIdParamT, BookingUpdateRequest, BookingResponseDto>()(async (req, res) => {
  const data = await svc.updateBooking(req.params.id, req.body);
  res.json(data);
});

export const destroy = withAuthenticatedParams<BookingIdParamT, void>()(async (req, res) => {
  await svc.deleteMyBooking(req.params.id, req?.user?.sub);
  res.status(204).end();
});
