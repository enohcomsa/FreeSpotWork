import type { BookingCreateRequest, BookingUpdateRequest, BookingResponseDto } from "../schemas/bookings.zod";
import * as repo from "../repos/bookings.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getBookings(): Promise<BookingResponseDto[]> { return repo.listBookings(); }

export async function getBooking(id: string): Promise<BookingResponseDto> {
  const res = await repo.getBookingById(id);
  if (!res) throw new NotFoundError("Booking not found");
  return res;
}

export async function createBooking(input: BookingCreateRequest): Promise<BookingResponseDto> {
  try { return await repo.createBooking(input); } catch (e) { mapMongoError(e); }
}

export async function updateBooking(id: string, patch: BookingUpdateRequest): Promise<BookingResponseDto> {
  try {
    const res = await repo.updateBookingById(id, patch);
    if (!res) throw new NotFoundError("Booking not found");
    return res;
  } catch (e) { mapMongoError(e); }
}

export async function deleteBooking(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteBookingById(id);
    if (!ok) throw new NotFoundError("Booking not found");
    return ok;
  } catch (e) { mapMongoError(e); }
}
