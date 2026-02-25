import { TimetableActivityDbDoc } from "../db/types";
import { getCollection, toObjectId } from "../utils/mongo";
import { TimetableActivityCardDto } from "../schemas/timetable-activities.card.zod";

const TIMETABLE_ACTIVITIES_COLLECTION = "timetable_activities";
const ROOMS_COLLECTION = "rooms";
const SUBJECTS_COLLECTION = "subjects";
const timetableActivityCardPipelineBase = [
  {
    $lookup: {
      from: ROOMS_COLLECTION,
      localField: "roomId",
      foreignField: "_id",
      as: "room",
      pipeline: [
        {
          $project: {
            name: 1,
          },
        },
      ],
    },
  },
  { $unwind: { path: "$room", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: SUBJECTS_COLLECTION,
      localField: "subjectId",
      foreignField: "_id",
      as: "subject",
      pipeline: [
        {
          $project: {
            shortName: 1,
          },
        },
      ],
    },
  },
  { $unwind: { path: "$subject", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 0,
      id: { $toString: "$_id" },
      weekDay: 1,
      startHour: 1,
      endHour: 1,
      weekParity: 1,
      activityType: 1,
      roomName: "$room.name",
      subjectItemShortName: "$subject.shortName"
    },
  },
];

export async function listTimetableActivityCards(): Promise<TimetableActivityCardDto[]> {
  const timetableActivities = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);

  const pipeline = [
    ...timetableActivityCardPipelineBase,
    { $sort: { weekDay: 1, startHour: 1 } },
  ];
  const data: TimetableActivityCardDto[] = await timetableActivities.aggregate<TimetableActivityCardDto>(pipeline).toArray();
  return data;
}

export async function getTimetableActivityCard(id: string): Promise<TimetableActivityCardDto | null> {
  const timetableActivities = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);
  const _id = toObjectId(id);

  if (!_id) return null;

  const pipeline = [
    { $match: _id },
    ...timetableActivityCardPipelineBase,
    { $limit: 1 },
  ];

  const doc = await timetableActivities.aggregate<TimetableActivityCardDto>(pipeline).next();
  return doc ?? null;
}

export async function listTimetableActivityCardsByRoomId(roomId: string): Promise<TimetableActivityCardDto[]> {
  const timetableActivities = await getCollection<TimetableActivityDbDoc>(TIMETABLE_ACTIVITIES_COLLECTION);

  const _roomId = toObjectId(roomId);
  if (!_roomId) {
    return [];
  }

  const pipeline = [
    { $match: { roomId: _roomId } },
    ...timetableActivityCardPipelineBase,
    { $sort: { weekDay: 1, startHour: 1 } },
  ];

  const data: TimetableActivityCardDto[] = await timetableActivities.aggregate<TimetableActivityCardDto>(pipeline).toArray();
  return data;
}
