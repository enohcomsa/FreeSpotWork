import { CollectionSpec } from "../migrate/helpers";

export const programYearsSpec: CollectionSpec = {
  name: "program_years",
  validator: {
    bsonType: "object",
    required: ["_id", "programId", "yearNumber", "label"],
    properties: {
      _id: { bsonType: "objectId" },
      programId: { bsonType: "objectId" },
      yearNumber: { bsonType: "int", minimum: 1, maximum: 10 },
      label: { bsonType: "string", minLength: 1 }
    },
    additionalProperties: false
  },
  indexes: [
    { key: { programId: 1, yearNumber: 1 }, name: "uniq_program_year", unique: true }
  ]
};
