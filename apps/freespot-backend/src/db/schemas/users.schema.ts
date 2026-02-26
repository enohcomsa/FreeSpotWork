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
      "groupCohortId",
    ],
    properties: {
      _id: { bsonType: "objectId" },

      email: {
        bsonType: "string",
        minLength: 3,
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
      },

      username: {
        oneOf: [
          { bsonType: "string", minLength: 3, maxLength: 50 },
          { bsonType: "null" }
        ]
      },

      firstName: { bsonType: "string", minLength: 1 },
      familyName: { bsonType: "string", minLength: 1 },

      role: { enum: ["ADMIN", "MEMBER"] },

      preferredLanguage: {
        oneOf: [{ enum: ["en", "ro"] }, { bsonType: "null" }]
      },
      preferredTheme: {
        oneOf: [{ enum: ["DARK", "LIGHT"] }, { bsonType: "null" }]
      },

      facultyId: { bsonType: "objectId" },
      programYearId: { bsonType: "objectId" },
      groupCohortId: { bsonType: "objectId" },
      semigroupCohortId: {
        oneOf: [{ bsonType: "objectId" }, { bsonType: "null" }]
      },

      emailVerified: { bsonType: "bool" },

      auth: {
        bsonType: "object",
        properties: {
          local: {
            bsonType: "object",
            properties: {
              hash: { bsonType: "string", minLength: 20 }
            },
            additionalProperties: false
          }
        },
        additionalProperties: false
      },

      security: {
        bsonType: "object",
        properties: {
          tokenVersion: { bsonType: "int", minimum: 0 }
        },
        additionalProperties: false
      },

      createdAt: { bsonType: "date" },
      updatedAt: { bsonType: "date" }
    },
    additionalProperties: false
  },

  indexes: [
    { key: { email: 1 }, name: "uniq_email", unique: true },
    {
      key: { username: 1 },
      name: "uniq_username",
      unique: true,
      partialFilterExpression: { username: { $type: "string" } }
    },
    { key: { groupCohortId: 1 }, name: "by_groupCohortId" },
    { key: { semigroupCohortId: 1 }, name: "by_semigroupCohortId" }
  ]
};
