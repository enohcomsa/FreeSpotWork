import { BuildingDbDoc, } from "../db/types";
import { getCollection, toObjectId } from "../utils/mongo";
import { BuildingCardDto } from "../schemas/buildings.card.zod";

const BUILDINGS_COLLECTION = "buildings";
const FLOORS_COLLECTION = "floors";
const ROOMS_COLLECTION = "rooms";
const buildingCardPipelineBase = [{
  $lookup: {
    from: FLOORS_COLLECTION,
    localField: "_id",
    foreignField: "buildingId",
    as: "floors",
  }
},
{ $unwind: { path: "$floors", preserveNullAndEmptyArrays: true } },
{
  $lookup: {
    from: ROOMS_COLLECTION,
    localField: "floors._id",
    foreignField: "floorId",
    as: "floorRooms",
    pipeline: [
      { $project: { totalSpotsNumber: 1, unavailableSpots: 1 } }
    ]
  }
},
{
  $addFields: {
    "floors.total": { $sum: "$floorRooms.totalSpotsNumber" },
    "floors.unavailable": { $sum: "$floorRooms.unavailableSpots" }
  }
},
{
  $group: {
    _id: "$_id",
    id: { $first: "$_id" },
    name: { $first: "$name" },
    address: { $first: "$address" },
    specialEvent: { $first: "$specialEvent" },
    floors: {
      $push: {
        name: "$floors.name",
        total: { $ifNull: ["$floors.total", 0] },
        unavailable: { $ifNull: ["$floors.unavailable", 0] }
      }
    }
  }
},
{
  $project: {
    _id: 0,
    id: { $toString: "$id" },
    name: 1,
    address: 1,
    specialEvent: { $ifNull: ["$specialEvent", false] },
    floors: {
      $filter: { input: "$floors", as: "f", cond: { $ne: ["$$f.name", null] } }
    }
  }
}]

export async function listBuildingCards(): Promise<BuildingCardDto[]> {
  const buildings = await getCollection<BuildingDbDoc>(BUILDINGS_COLLECTION);

  const pipeline = [
    ...buildingCardPipelineBase,
    { $sort: { name: 1 } }
  ]
  const data: BuildingCardDto[] = await buildings.aggregate<BuildingCardDto>(pipeline).toArray();
  return data;
}

export async function getBuildingCard(id: string): Promise<BuildingCardDto | null> {
  const buildings = await getCollection<BuildingDbDoc>(BUILDINGS_COLLECTION);
  const _id = toObjectId(id);

  if (!_id) return null;

  const pipeline = [
    { $match: { _id } },
    ...buildingCardPipelineBase,
    { $limit: 1 },
  ];

  const doc = await buildings.aggregate<BuildingCardDto>(pipeline).next();
  return doc ?? null;
}
