import { CollectionSpec } from "../migrate/helpers";

export const cohortsSpec: CollectionSpec = {
  name: "cohorts",
  validator: {
    bsonType: "object",
    required: ["_id", "type", "programYearId", "name", "parentGroupId"],
    properties: {
      _id: { bsonType: "objectId" },
      type: { enum: ["GROUP", "SEMIGROUP"] },
      programYearId: { bsonType: "objectId" },
      name: { bsonType: "string", minLength: 1 },
      parentGroupId: { bsonType: ["objectId", "null"] }
    },
    additionalProperties: false
  },
  indexes: [
    { key: { programYearId: 1, name: 1 }, name: "uniq_year_name", unique: true },
    { key: { parentGroupId: 1 }, name: "by_parent_group" }
  ]
};
