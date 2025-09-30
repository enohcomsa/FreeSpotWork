import { CollectionSpec } from "../migrate/helpers";

export const subjectsSpec: CollectionSpec = {
  name: "subjects",
  validator: {
    bsonType: "object",
    required: ["_id", "name", "shortName"],
    properties: {
      _id: { bsonType: "objectId" },
      name: { bsonType: "string", minLength: 1 },
      shortName: { bsonType: "string", minLength: 1 }
    },
    additionalProperties: false
  },
  indexes: [
    { key: { shortName: 1 }, name: "uniq_shortName", unique: true }
  ]
};
