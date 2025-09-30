
import type { BookingCreateInput, BookingUpdateInput, BookingResponseDto } from "../schemas/bookings.zod";import * as repo from "../repos/bookings.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getBooking(id: string): Promise<BookingResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("Booking not found");
  return res;
}

export async function createBooking(input: BookingCreateInput): Promise<BookingResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateBooking(id: string, patch: BookingUpdateInput): Promise<BookingResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("Booking not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteBooking(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("Booking not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
