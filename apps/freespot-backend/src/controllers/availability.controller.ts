import type { RescheduleOptionsQueryInput, RescheduleOptionsResponseDto } from "../schemas/availability.zod";
import { getRescheduleOptions } from "../services/availability.service";
import { withAuthenticatedQuery } from "../utils/async-handler";

export const listRescheduleOptions = withAuthenticatedQuery<RescheduleOptionsQueryInput, RescheduleOptionsResponseDto>()
  (async (req, res) => {
    const data = await getRescheduleOptions(req.query);
    res.json(data);
  });
