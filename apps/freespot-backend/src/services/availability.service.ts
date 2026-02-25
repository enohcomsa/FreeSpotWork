// src/services/availability.service.ts
import type { AvailabilityQueryInput, AvailabilityResponseDto } from "../schemas/availability.zod";
// import { findAvailabilitySimple } from "../repos/availability.repo";

export async function findAvailability(q: AvailabilityQueryInput): Promise<AvailabilityResponseDto> {
  // Add any extra guards or business rules here if needed
  return findAvailability(q);
}
