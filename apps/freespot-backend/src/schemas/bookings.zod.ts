import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr, BookingStatus, Source, ISODateStr } from "./common.zod";
import { strictObj, nonEmptyPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const BookingBase = strictObj({
  activityId: ObjectIdStr,
  userId: ObjectIdStr,
  status: BookingStatus.default("WAITLISTED"),
  cohortId: ObjectIdStr.nullable().optional(),
  source: Source.nullable().optional(),
}).openapi("BookingCreate");

export const BookingIdParam = z.object({ id: ObjectIdStr }).openapi("BookingIdParam");
export const BookingCreate = BookingBase.openapi("BookingCreate");
export const BookingUpdate = nonEmptyPatch(BookingBase.partial()).openapi("BookingUpdate");
export const BookingResponse = BookingBase.extend({
  id: ObjectIdStr,
  createdAt: ISODateStr,
  updatedAt: ISODateStr.nullable().optional(),
}).openapi("BookingResponse");
export const BookingList = z.array(BookingResponse).openapi("BookingList");

export type BookingBaseT = z.infer<typeof BookingBase>;
export type BookingCreateRequest = z.infer<typeof BookingCreate>;
export type BookingUpdateRequest = z.infer<typeof BookingUpdate>;
export type BookingIdParamT = z.infer<typeof BookingIdParam>;
export type BookingResponseDto = z.infer<typeof BookingResponse>;
