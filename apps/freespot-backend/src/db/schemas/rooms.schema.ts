import { CollectionSpec } from "../migrate/helpers";

export const roomsSpec: CollectionSpec = {
  name: "rooms",
  validator: {
    bsonType: "object",
    required: [
      "_id",
      "buildingId",
      "floorId",
      "name",
      "totalSpotsNumber",
      "unavailableSpots",
      "subjectList"
    ],
    properties: {
      _id: { bsonType: "objectId" },
      buildingId: { bsonType: "objectId" },
      floorId: { bsonType: "objectId" },
      name: { bsonType: "string", minLength: 1 },
      totalSpotsNumber: { bsonType: "int", minimum: 0 },
      unavailableSpots: { bsonType: "int", minimum: 0 },
      subjectList: {
        bsonType: "array",
        minItems: 0,
        uniqueItems: true,
        items: { bsonType: "objectId" }
      }
    },
    additionalProperties: false
  },
  indexes: [
    {
      key: { buildingId: 1, floorId: 1, name: 1 },
      name: "uniq_building_floor_room",
      unique: true
    }
  ]
};
