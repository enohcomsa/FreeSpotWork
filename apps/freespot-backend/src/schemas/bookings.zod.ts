import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr, BookingStatus, ActivityType, ISODateStr } from "./common.zod";
import { strictObj, nonEmptyDefinedPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

export const BookingBase = strictObj({
  activityId: ObjectIdStr,
  userId: ObjectIdStr,

  facultyId: ObjectIdStr.nullable().optional(),
  programId: ObjectIdStr.nullable().optional(),
  programYearId: ObjectIdStr.nullable().optional(),
  groupCohortId: ObjectIdStr.nullable().optional(),
  semigroupCohortId: ObjectIdStr.nullable().optional(),

  subjectId: ObjectIdStr.nullable().optional(),
  activityType: ActivityType,

  status: BookingStatus.default("WAITLISTED"),

  originalActivityId: ObjectIdStr.nullable().optional(),
  isRescheduled: z.boolean().nullable().optional(),
  rescheduledAt: ISODateStr.nullable().optional(),
}).openapi("BookingBase");

export const BookingIdParam = z.object({ id: ObjectIdStr }).openapi("BookingIdParam");
export const BookingCreate = BookingBase.openapi("BookingCreate");
export const BookingUpdate = nonEmptyDefinedPatch(BookingBase.partial()).openapi("BookingUpdate");

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
