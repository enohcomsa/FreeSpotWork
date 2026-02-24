import { CollectionSpec } from "../migrate/helpers";

export const eventsSpec: CollectionSpec = {
  name: "events",
  validator: {
    bsonType: "object",
    required: ["type", "name", "date", "startHour", "buildingId", "roomId", "reservedSpots"],
    properties: {
      _id: { bsonType: "objectId" },
      type: { enum: ["SPECIAL"] },
      name: { bsonType: "string", minLength: 1 },
      date: { bsonType: "date" },
      startHour: { bsonType: "int", minimum: 0, maximum: 23 },
      buildingId: { bsonType: "objectId" },
      roomId: { bsonType: "objectId" },
      reservedSpots: { bsonType: "int", minimum: 0 },
    },
    additionalProperties: false,
  },
  indexes: [
    { key: { date: 1 }, name: "idx_date" },
    { key: { buildingId: 1, date: 1 }, name: "idx_building_date" },
    { key: { roomId: 1, date: 1, startHour: 1 }, name: "uniq_room_timeslot", unique: true },
  ],
};
