import { CollectionSpec } from "../migrate/helpers";

export const floorsSpec: CollectionSpec = {
  name: "floors",
  validator: {
    bsonType: "object",
    required: ["buildingId", "name"],
    properties: {
      _id: { bsonType: "objectId" },
      buildingId: { bsonType: "objectId" },
      name: { bsonType: "string", minLength: 1 },
    },
    additionalProperties: false
  },
  indexes: [
    { key: { buildingId: 1, name: 1 }, name: "uniq_building_floor", unique: true }
  ]
};
