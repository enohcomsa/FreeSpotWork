import {
  ObjectId,
  Collection,
  Filter,
  WithId,
} from "mongodb";
import { connectToDatabase } from "../db";
import {
  AvailabilityQueryInput,
  AvailabilityResponseDto,
  AvailabilitySlotDto,
} from "../schemas/availability.zod";

//update this later

type BookingStatusT = "CONFIRMED" | "WAITLISTED" | "CANCELLED";

interface TimetableActivityDoc {
  _id?: ObjectId;
  roomId: ObjectId;
  subjectId?: ObjectId;
  cohortIds?: ObjectId[];
  date: string;
  startHour: number;
  endHour: number;
  capacity: number;
}

interface RoomDoc {
  _id?: ObjectId;
  totalSpotsNumber: number;
  unavailableSpots: number;
}

interface BookingDoc {
  _id?: ObjectId;
  activityId: ObjectId;
  status: BookingStatusT;
}

interface RoomCapDoc {
  _id: ObjectId;
  totalSpotsNumber: number;
  unavailableSpots: number;
}

interface BookingGroupAgg {
  _id: { activityId: ObjectId; status: BookingStatusT };
  count: number;
}

export async function findAvailabilitySimple(
  q: AvailabilityQueryInput
): Promise<AvailabilityResponseDto> {
  const db = await connectToDatabase();

  const activitiesCol: Collection<TimetableActivityDoc> =
    db.collection<TimetableActivityDoc>("timetable_activities");
  const roomsCol: Collection<RoomDoc> =
    db.collection<RoomDoc>("rooms");
  const bookingsCol: Collection<BookingDoc> =
    db.collection<BookingDoc>("bookings");

  const match: Filter<TimetableActivityDoc> = {
    date: q.date,
    ...(q.roomId ? { roomId: new ObjectId(q.roomId) } : {}),
    ...(q.subjectId ? { subjectId: new ObjectId(q.subjectId) } : {}),
    ...(q.cohortId ? { cohortIds: new ObjectId(q.cohortId) } : {}),
  };

  const limit = q.limit ?? 100;

  const activityDocs: WithId<TimetableActivityDoc>[] = await activitiesCol
    .find(match)
    .limit(limit)
    .toArray();

  const start = q.startHour;
  const end = q.endHour;
  const filteredByTime: WithId<TimetableActivityDoc>[] =
    start !== undefined && end !== undefined
      ? activityDocs.filter((a) => a.startHour < end && a.endHour > start)
      : activityDocs;

  const roomIds: ObjectId[] = Array.from(
    new Set(filteredByTime.map((a) => a.roomId.toHexString()))
  ).map((id) => new ObjectId(id));

  const rooms: RoomCapDoc[] = await roomsCol
    .find<RoomCapDoc>({ _id: { $in: roomIds } }, { projection: { totalSpotsNumber: 1, unavailableSpots: 1 } })
    .toArray();

  const roomMap = new Map<string, RoomCapDoc>(
    rooms.map((r) => [r._id.toHexString(), r])
  );

  const activityIds: ObjectId[] = filteredByTime.map((a) => a._id as ObjectId);

  const bookingCounts: BookingGroupAgg[] = await bookingsCol
    .aggregate<BookingGroupAgg>([
      {
        $match: {
          activityId: { $in: activityIds },
          status: { $in: ["CONFIRMED", "WAITLISTED"] as BookingStatusT[] },
        },
      },
      {
        $group: {
          _id: { activityId: "$activityId", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const countsByActivity = new Map<string, { confirmed: number; waitlisted: number }>();
  for (const b of bookingCounts) {
    const key = b._id.activityId.toHexString();
    const curr = countsByActivity.get(key) ?? { confirmed: 0, waitlisted: 0 };
    if (b._id.status === "CONFIRMED") curr.confirmed += b.count;
    if (b._id.status === "WAITLISTED") curr.waitlisted += b.count;
    countsByActivity.set(key, curr);
  }

  const minFree = q.minFreeSpots ?? 1;

  const slots: AvailabilitySlotDto[] = [];
  for (const a of filteredByTime) {
    const roomCaps = roomMap.get(a.roomId.toHexString());
    const effectiveRoomCap = Math.max(
      (roomCaps?.totalSpotsNumber ?? 0) - (roomCaps?.unavailableSpots ?? 0),
      0
    );
    const capacity = Math.min(a.capacity, effectiveRoomCap);

    const counts = countsByActivity.get((a._id as ObjectId).toHexString()) ?? {
      confirmed: 0,
      waitlisted: 0,
    };
    const busySpots = counts.confirmed;
    const reservedSpots = counts.waitlisted;
    const freeSpots = Math.max(capacity - busySpots, 0);

    if (freeSpots >= minFree) {
      const slot: AvailabilitySlotDto = {
        date: a.date,
        roomId: a.roomId.toHexString(),
        startHour: a.startHour,
        endHour: a.endHour,
        capacity,
        reservedSpots,
        busySpots,
        freeSpots,
        subjectId: a.subjectId ? a.subjectId.toHexString() : undefined,
        activityId: (a._id as ObjectId).toHexString(),
        cohortIds: a.cohortIds ? a.cohortIds.map((id) => id.toHexString()) : undefined,
      };
      slots.push(slot);
    }
    if (slots.length >= limit) break;
  }

  return { items: slots, total: slots.length };
}
