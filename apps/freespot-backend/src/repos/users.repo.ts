import { UserDbDoc, UserDbRecord } from "../db/types";
import { userPatchToDbSet, userToDbRecord, userToDto } from "../mappers";
import { UserCreateRequest, UserResponseDto, UserUpdateRequest } from "../schemas/users.zod";
import { getCollection, isEmptySet, toObjectId } from "../utils/mongo";

const USERS_COLLECTION = "users";

// findByEmailOrUsername(identifier: string)

// insert(userRecord)

// (optional) findById(id)

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

export async function createUser(input: UserCreateRequest): Promise<UserResponseDto> {
  const collection = await getCollection<UserDbRecord>(USERS_COLLECTION);
  const record = userToDbRecord(input);
  const result = await collection.insertOne(record);
  return userToDto({ _id: result.insertedId, ...record });
}

export async function updateUserById(id: string, patch: UserUpdateRequest): Promise<UserResponseDto | null> {
  const collection = await getCollection<UserDbDoc>(USERS_COLLECTION);
  const updateSet = userPatchToDbSet(patch);
  if (isEmptySet(updateSet)) {
    const current = await collection.findOne({ _id: toObjectId(id) });
    return current ? userToDto(current) : null;
  }
  const updated = await collection.findOneAndUpdate({ _id: toObjectId(id) }, { $set: updateSet }, { returnDocument: "after" });
  return updated ? userToDto(updated) : null;
}

export async function deleteUserById(id: string): Promise<boolean> {
  const collection = await getCollection<UserDbDoc>(USERS_COLLECTION);
  const { deletedCount } = await collection.deleteOne({ _id: toObjectId(id) });
  return deletedCount === 1;
}
