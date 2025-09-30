import { CollectionSpec } from "../migrate/helpers";

export const programsSpec: CollectionSpec = {
  name: "programs",
  validator: {
    bsonType: "object",
    required: ["_id", "facultyId", "name", "degree", "active"],
    properties: {
      _id: { bsonType: "objectId" },
      facultyId: { bsonType: "objectId" },
      name: { bsonType: "string", minLength: 1 },
      degree: { enum: ["lic", "master", "doct"], description: "Degree tag" },
      active: { bsonType: "bool" }
    },
    additionalProperties: false
  },
  indexes: [
    { key: { facultyId: 1, name: 1 }, name: "uniq_faculty_program", unique: true }
  ]
};
