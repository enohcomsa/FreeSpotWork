import type { ObjectId } from "mongodb";
import type { UserAuthProjection, UserDbDoc, UserDbRecord } from "../db/types";
import { signupToDbRecord, userPatchToDbSet, userToDto } from "../mappers";
import type { SignupRequestT } from "../schemas/auth.zod";
import type { UserResponseDto, UserUpdateRequest } from "../schemas/users.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const USERS_COLLECTION = "users";

const authProjection = {
  _id: 1,
  email: 1,
  username: 1,
  role: 1,
  emailVerified: 1,
  auth: 1,
  security: 1,
} as const;

export async function findUserAuthById(userId: ObjectId): Promise<UserAuthProjection | null> {
  const collection = await getCollection<UserDbDoc>(USERS_COLLECTION);
  return collection.findOne<UserAuthProjection>({ _id: userId }, { projection: authProjection });
}

export async function findUserAuthByIdentifier(identifier: string): Promise<UserAuthProjection | null> {
  const ident = identifier.trim().toLowerCase();
  const collection = await getCollection<UserDbDoc>(USERS_COLLECTION);
  return collection.findOne<UserAuthProjection>(
    { $or: [{ email: ident }, { username: ident }] },
    { projection: authProjection }
  );
}

export async function listUsers(): Promise<UserResponseDto[]> {
  const collection = await getCollection<UserDbDoc>(USERS_COLLECTION);
  const docs = await collection.find({}).sort({ familyName: 1, firstName: 1 }).toArray();
  return docs.map(userToDto);
}

export async function getUserById(id: string): Promise<UserResponseDto | null> {
  const collection = await getCollection<UserDbDoc>(USERS_COLLECTION);
  const doc = await collection.findOne({ _id: toObjectId(id) });
  return doc ? userToDto(doc) : null;
}

/**
 * Signup create (minimal user) - returns auth projection so auth service can issue tokens without extra lookup.
 * TODO: Consider separate "signup_users" / "pending_users" collection to avoid nullable profile fields in users.
 */
export async function createUser(input: SignupRequestT, passwordHash: string): Promise<UserAuthProjection> {
  const collection = await getCollection<UserDbRecord>(USERS_COLLECTION);

  const record = signupToDbRecord(input, passwordHash);
  const result = await collection.insertOne(record);

  return {
    _id: result.insertedId,
    email: record.email,
    username: record.username ?? null,
    role: record.role,
    emailVerified: record.emailVerified,
    auth: record.auth,
    security: record.security,
  };
}

export async function updateUserById(id: string, patch: UserUpdateRequest): Promise<UserResponseDto | null> {
  const collection = await getCollection<UserDbDoc>(USERS_COLLECTION);
  const updateSet = userPatchToDbSet(patch);

  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? userToDto(current) : null;
  }

  const updated = await collection.findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: updateSet },
    { returnDocument: "after" }
  );

  return updated ? userToDto(updated) : null;
}

export async function deleteUserById(id: string): Promise<boolean> {
  const collection = await getCollection<UserDbDoc>(USERS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}

export async function bumpTokenVersion(userId: ObjectId): Promise<boolean> {
  const collection = await getCollection<UserDbDoc>(USERS_COLLECTION);
  const res = await collection.updateOne(
    { _id: userId },
    { $inc: { "security.tokenVersion": 1 }, $set: { updatedAt: new Date() } }
  );
  return res.matchedCount === 1;
}
