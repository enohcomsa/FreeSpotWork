import { MongoClient, Db, IndexDescription, Document } from "mongodb";

export type JsonSchema = Document;
export interface CollectionSpec {
  name: string;
  validator: JsonSchema;
  indexes?: IndexDescription[];
  validationLevel?: "off" | "moderate" | "strict";
  validationAction?: "warn" | "error";
}

export async function withDb<T>(uri: string, fn: (db: Db) => Promise<T>, dbName?: string) {
  const client = new MongoClient(uri);
  await client.connect();
  try {
    const db = dbName ? client.db(dbName) : client.db();
    return await fn(db);
  } finally {
    await client.close();
  }
}

export async function ensureCollection(db: Db, spec: CollectionSpec) {
  const { name, validator, indexes = [], validationLevel = "strict", validationAction = "error" } = spec;

  const existing = await db.listCollections({ name }).next();

  if (!existing) {
    await db.createCollection(name, {
      validator: { $jsonSchema: validator },
      validationLevel,
      validationAction,
    });
  } else {
    await db.command({
      collMod: name,
      validator: { $jsonSchema: validator },
      validationLevel,
      validationAction,
    });
  }

  if (indexes.length) {
    await db.collection(name).createIndexes(indexes);
  }
}
