import { CollectionSpec } from "../migrate/helpers";

export const refreshTokensSpec: CollectionSpec = {
  name: "refresh_tokens",
  validator: {
    bsonType: "object",
    required: ["_id", "userId", "jti", "tokenHash", "createdAt", "expiresAt"],
    properties: {
      _id: { bsonType: "objectId" },

      userId: { bsonType: "objectId" },

      jti: { bsonType: "string", minLength: 10 },

      tokenHash: { bsonType: "string", minLength: 20 },

      createdAt: { bsonType: "date" },
      expiresAt: { bsonType: "date" },

      revokedAt: {
        oneOf: [{ bsonType: "date" }, { bsonType: "null" }]
      },

      ip: {
        oneOf: [{ bsonType: "string", minLength: 3, maxLength: 80 }, { bsonType: "null" }]
      },
      userAgent: {
        oneOf: [{ bsonType: "string", minLength: 3, maxLength: 512 }, { bsonType: "null" }]
      }
    },
    additionalProperties: false
  },
  indexes: [
    { key: { tokenHash: 1 }, name: "uniq_tokenHash", unique: true },
    { key: { userId: 1 }, name: "by_userId" },
    { key: { expiresAt: 1 }, name: "ttl_expiresAt", expireAfterSeconds: 0 }
  ]
};
