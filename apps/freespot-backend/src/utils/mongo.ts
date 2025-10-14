import { Collection, Db, ObjectId } from "mongodb";
import { connectToDatabase } from "../db";

/**
 * Extends a Zod base schema with MongoDB's `_id` field.
 * Use this to represent actual documents stored in a collection.
 */
export type MongoDoc<TBase> = TBase & { _id: ObjectId };

/**
 * Same as `MongoDoc`, but `_id` is optional.
 * Useful for new documents before they are inserted.
 */
export type MongoRecord<TBase> = TBase & { _id?: ObjectId };

/**
 * Get a strongly typed MongoDB collection.
 * @param name - Collection name.
 */
export async function getCollection<TDoc>(name: string): Promise<Collection<TDoc>> {
  const db: Db = await connectToDatabase();
  return db.collection<TDoc>(name);
}

/**
 * Convert a string to a MongoDB ObjectId.
 * @throws If the string is not a valid ObjectId.
 */
export function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId format");
  }
  return new ObjectId(id);
}

/**
 * Maps a MongoDB document (`_id: ObjectId`) to a DTO (`id: string`),
 * preserving all other fields.
 */
export function mapToDto<T extends { _id: ObjectId }, U>(doc: T): U {
  const { _id, ...rest } = doc;
  return { id: _id.toHexString(), ...rest } as U;
}

/**
 * Removes all properties with `undefined` values from an object.
 * Useful for building MongoDB `$set` patches so only explicitly
 * provided fields are updated.
 */
export function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}
