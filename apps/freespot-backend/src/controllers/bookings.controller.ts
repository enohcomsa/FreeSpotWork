import type {
  BookingIdParamT,
  BookingUserIdParamT,
  BookingRescheduleRequest,
  BookingUpdateRequest,
  BookingResponseDto
} from "../schemas/bookings.zod";
import * as svc from "../services/bookings.service";
import { withParams, withParamsAndBody, withQuery } from "../utils/async-handler";

export const listMine = withQuery<unknown, BookingResponseDto[]>()(async (req, res) => {
  const data = await svc.getMyBookings(req.user!.sub);
  res.json(data);
});

export const listByUserIdAdmin = withParams<BookingUserIdParamT, BookingResponseDto[]>()(async (req, res) => {
  const data = await svc.getBookingsByUserIdForAdmin(req.params.userId);
  res.json(data);
});

export const getById = withParams<BookingIdParamT, BookingResponseDto>()(async (req, res) => {
  const data = await svc.getMyBooking(req.params.id, req.user!.sub);
  res.json(data);
});

export async function create(req, res, next) {
  try {
    const result = await svc.createBooking(req.user.sub, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export const reschedule = withParamsAndBody<BookingIdParamT, BookingRescheduleRequest, BookingResponseDto>()(async (req, res) => {
  const data = await svc.rescheduleMyBooking(req.params.id, req.user!.sub, req.body);
  res.json(data);
});

export const update = withParamsAndBody<BookingIdParamT, BookingUpdateRequest, BookingResponseDto>()(async (req, res) => {
  const data = await svc.updateBooking(req.params.id, req.body);
  res.json(data);
});

export const destroy = withParams<BookingIdParamT, void>()(async (req, res) => {
  await svc.deleteMyBooking(req.params.id, req.user!.sub);
  res.status(204).end();
});
