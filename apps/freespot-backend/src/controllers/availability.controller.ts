import type { AvailabilityQueryInput, AvailabilityResponseDto } from "../schemas/availability.zod";
import { findAvailability } from "../services/availability.service";
import { asyncHandler } from "../utils/async-handler";
import type { ParsedQs } from "qs";

export const list = asyncHandler<Record<string, string>, AvailabilityResponseDto, object, ParsedQs>(async (req, res) => {
  const q = req.query as unknown as AvailabilityQueryInput;
  const data = await findAvailability(q);
  res.json(data);
});
