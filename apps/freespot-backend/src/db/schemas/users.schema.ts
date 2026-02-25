import { CollectionSpec } from "../migrate/helpers";

export const usersSpec: CollectionSpec = {
  name: "users",
  validator: {
    bsonType: "object",
    required: [
      "_id",
      "email",
      "firstName",
      "familyName",
      "role",
      "facultyId",
      "programYearId",
      "groupCohortId"
    ],
    properties: {
      _id: { bsonType: "objectId" },
      email: {
        bsonType: "string",
        minLength: 3,
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
      },
      firstName: { bsonType: "string", minLength: 1 },
      familyName: { bsonType: "string", minLength: 1 },
      role: { enum: ["ADMIN", "MEMBER"] },
      preferredLanguage: {
        oneOf: [
          { enum: ["en", "ro"] },
          { bsonType: "null" }
        ]
      },
      preferredTheme: {
        oneOf: [
          { enum: ["DARK", "LIGHT"] },
          { bsonType: "null" }
        ]
      },
      facultyId: { bsonType: "objectId" },
      programYearId: { bsonType: "objectId" },
      groupCohortId: { bsonType: "objectId" },
      semigroupCohortId: {
        oneOf: [
          { bsonType: "objectId" },
          { bsonType: "null" }
        ]
      }
    },
    additionalProperties: false
  },
  indexes: [
    { key: { email: 1 }, name: "uniq_email", unique: true },
    { key: { groupCohortId: 1 }, name: "by_groupCohortId" },
    { key: { semigroupCohortId: 1 }, name: "by_semigroupCohortId" }
  ]
};
