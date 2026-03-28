import type { RescheduleOptionsQueryInput, RescheduleOptionsResponseDto } from "../schemas/availability.zod";
import { getRescheduleOptions } from "../services/availability.service";
import { asyncHandler } from "../utils/async-handler";
import type { ParsedQs } from "qs";

export const listRescheduleOptions = asyncHandler<Record<string, string>, RescheduleOptionsResponseDto, object, ParsedQs>(async (req, res) => {
  const q = req.query as unknown as RescheduleOptionsQueryInput;
  const data = await getRescheduleOptions(q);
  res.json(data);
});
