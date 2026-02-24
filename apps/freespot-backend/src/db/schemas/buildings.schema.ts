import { CollectionSpec } from "../migrate/helpers";

export const buildingsSpec: CollectionSpec = {
  name: "buildings",
  validator: {
    bsonType: "object",
    required: ["name", "address"],
    properties: {
      _id: { bsonType: "objectId" },
      name: { bsonType: "string", minLength: 1 },
      address: { bsonType: "string", minLength: 1 },
    },
    additionalProperties: false
  },
  indexes: [
    { key: { name: 1 }, name: "uniq_name", unique: true }
  ]
};
