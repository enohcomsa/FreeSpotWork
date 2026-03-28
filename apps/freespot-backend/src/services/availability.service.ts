import type { RescheduleOptionsQueryInput, RescheduleOptionsResponseDto } from "../schemas/availability.zod";
import { findRescheduleOptions } from "../repos/availability.repo";
import { NotFoundError } from "./errors";

export async function getRescheduleOptions(q: RescheduleOptionsQueryInput): Promise<RescheduleOptionsResponseDto> {
  const res = await findRescheduleOptions(q.bookingId);
  if (!res) throw new NotFoundError("Booking not found");
  return res;
}
