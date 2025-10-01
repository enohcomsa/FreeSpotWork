import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

import { ObjectIdStr, BookingStatus, Source, ISODateStr } from "./common.zod";

export const BookingIdParam = z.object({ id: ObjectIdStr }).openapi("BookingIdParam");

export const BookingCreate = z.object({
  activityId: ObjectIdStr,
  userId: ObjectIdStr,
  status: BookingStatus.default("WAITLISTED"),
  cohortId: ObjectIdStr.nullable().optional(),
  source: Source.nullable().optional(),
}).openapi("BookingCreate");

export const BookingUpdate = z.object({
  activityId: ObjectIdStr.optional(),
  status: BookingStatus.optional(),
}).refine(v => Object.keys(v).length > 0, { message: "Provide at least one field to update" }).openapi("BookingUpdate");

export const BookingResponse = z.object({
  id: ObjectIdStr,
  activityId: ObjectIdStr,
  userId: ObjectIdStr,
  cohortId: ObjectIdStr.nullable().optional(),
  status: BookingStatus,
  createdAt: ISODateStr,
  updatedAt: ISODateStr.nullable().optional(),
  source: Source.nullable().optional(),
}).openapi("BookingResponse");

export type BookingCreateInput = z.infer<typeof BookingCreate>;
export type BookingUpdateInput = z.infer<typeof BookingUpdate>;
export type BookingIdParamInput = z.infer<typeof BookingIdParam>;
export type BookingResponseDto = z.infer<typeof BookingResponse>;
