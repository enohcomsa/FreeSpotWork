import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ObjectIdStr } from "./common.zod";
import { strictObj, nonEmptyDefinedPatch } from "../utils/zod-helpers";

extendZodWithOpenApi(z);

const EventType = z.enum(["SPECIAL"]).openapi("EventType");

const EventBase = strictObj({
  type: EventType.default("SPECIAL"),
  name: z.string().trim().min(1),
  date: z.coerce.date(),
  startHour: z.number().int().min(0).max(23),
  buildingId: ObjectIdStr,
  roomId: ObjectIdStr,
  reservedSpots: z.number().int().min(0),
}).openapi("EventBase");

export const EventIdParam = strictObj({ id: ObjectIdStr }).openapi("EventIdParam");
export const EventCreate = EventBase.openapi("EventCreate");
export const EventUpdate = nonEmptyDefinedPatch(EventBase.partial()).openapi("EventUpdate");

export const EventResponse = EventBase.extend({
  id: ObjectIdStr,
  date: z.string(),
}).openapi("EventResponse");

export const EventList = z.array(EventResponse).openapi("EventList");

export type EventBaseT = z.infer<typeof EventBase>;
export type EventCreateRequest = z.infer<typeof EventCreate>;
export type EventUpdateRequest = z.infer<typeof EventUpdate>;
export type EventIdParamT = z.infer<typeof EventIdParam>;
export type EventResponseDto = z.infer<typeof EventResponse>;
