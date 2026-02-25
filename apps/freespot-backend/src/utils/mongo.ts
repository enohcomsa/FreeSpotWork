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
 * Make all keys optional and remove `undefined` from value types.
 */
type StripUndef<T extends object> = {
  [K in keyof T]?: Exclude<T[K], undefined>;
};

/**
 * Removes all properties with `undefined` values from an object.
 * Useful for building MongoDB `$set` patches so only explicitly
 * provided fields are updated.
 */
export function stripUndefined<T extends object>(obj: T): StripUndef<T> {
  return Object.fromEntries(Object.entries(obj as Record<string, unknown>).filter(([, v]) => v !== undefined)) as StripUndef<T>;
}

/**
 * Checks whether the given object has no own enumerable properties.
 *
 * @template T - The type of object being checked.
 * @param obj - The object to inspect.
 * @returns `true` if the object has no keys, otherwise `false`.
 *
 * @example
 * isEmptySet({}); // true
 * isEmptySet({ a: 1 }); // false
 */
export function isEmptySet<T extends Record<string, unknown>>(obj: T): boolean {
  return Object.keys(obj).length === 0;
}
