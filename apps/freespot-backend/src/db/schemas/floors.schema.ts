import { CollectionSpec } from "../migrate/helpers";

export const floorsSpec: CollectionSpec = {
  name: "floors",
  validator: {
    bsonType: "object",
    required: ["buildingId", "name", "totalSpotsNumber", "unavailableSpots"],
    properties: {
      _id: { bsonType: "objectId" },
      buildingId: { bsonType: "objectId" },
      name: { bsonType: "string", minLength: 1 },
      totalSpotsNumber: { bsonType: "int", minimum: 0 },
      unavailableSpots: { bsonType: "int", minimum: 0 }
    },
    additionalProperties: false
  },
  indexes: [
    { key: { buildingId: 1, name: 1 }, name: "uniq_building_floor", unique: true }
  ]
};
