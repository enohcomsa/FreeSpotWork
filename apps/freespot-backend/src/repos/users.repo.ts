import { ObjectId, WithId, Collection, FindOneAndUpdateOptions } from "mongodb";
import { connectToDatabase } from "../db";
import {
  UserCreateInput,
  UserUpdateInput,
  UserResponseDto,
} from "../schemas/users.zod";
import { UserRole, PreferredLanguage, PreferredTheme } from "../schemas/common.zod";
import { z } from "zod";

type UserRoleT = z.infer<typeof UserRole>;
type PreferredLanguageT = z.infer<typeof PreferredLanguage> | null;
type PreferredThemeT = z.infer<typeof PreferredTheme> | null;

interface UserDoc {
  _id?: ObjectId;
  email: string;
  firstName: string;
  familyName: string;
  role: UserRoleT;
  preferredLanguage: PreferredLanguageT;
  preferredTheme: PreferredThemeT;
  facultyId: ObjectId;
  programYearId: ObjectId;
  groupCohortId: ObjectId;
  semigroupCohortId: ObjectId | null;
}

async function getCollection(): Promise<Collection<UserDoc>> {
  const db = await connectToDatabase();
  return db.collection<UserDoc>("users");
}

function mapToDto(doc: WithId<UserDoc>): UserResponseDto {
  return {
    id: doc._id.toHexString(),
    email: doc.email,
    firstName: doc.firstName,
    familyName: doc.familyName,
    role: doc.role,
    preferredLanguage: doc.preferredLanguage,
    preferredTheme: doc.preferredTheme,
    facultyId: doc.facultyId.toHexString(),
    programYearId: doc.programYearId.toHexString(),
    groupCohortId: doc.groupCohortId.toHexString(),
    semigroupCohortId: doc.semigroupCohortId ? doc.semigroupCohortId.toHexString() : null,
  };
}

export async function findById(id: string): Promise<UserResponseDto | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? mapToDto(doc as WithId<UserDoc>) : null;
}

export async function insertOne(input: UserCreateInput): Promise<UserResponseDto> {
  const col = await getCollection();
  const doc: UserDoc = {
    email: input.email,
    firstName: input.firstName,
    familyName: input.familyName,
    role: input.role as UserRoleT,
    preferredLanguage:
      typeof input.preferredLanguage === "string" ? (input.preferredLanguage as PreferredLanguageT) : null,
    preferredTheme:
      typeof input.preferredTheme === "string" ? (input.preferredTheme as PreferredThemeT) : null,
    facultyId: new ObjectId(input.facultyId),
    programYearId: new ObjectId(input.programYearId),
    groupCohortId: new ObjectId(input.groupCohortId),
    semigroupCohortId: input.semigroupCohortId ? new ObjectId(input.semigroupCohortId) : null,
  };
  const result = await col.insertOne(doc);
  const withId: WithId<UserDoc> = { _id: result.insertedId, ...doc };
  return mapToDto(withId);
}

export async function updateById(
  id: string,
  patch: UserUpdateInput
): Promise<UserResponseDto | null> {
  const col = await getCollection();
  const setPatch: Partial<UserDoc> = {};
  if (patch.firstName) setPatch.firstName = patch.firstName;
  if (patch.familyName) setPatch.familyName = patch.familyName;
  if (patch.role) setPatch.role = patch.role as UserRoleT;
  if ("preferredLanguage" in patch) {
    setPatch.preferredLanguage =
      typeof patch.preferredLanguage === "string" ? (patch.preferredLanguage as PreferredLanguageT) : null;
  }
  if ("preferredTheme" in patch) {
    setPatch.preferredTheme =
      typeof patch.preferredTheme === "string" ? (patch.preferredTheme as PreferredThemeT) : null;
  }
  if (patch.facultyId) setPatch.facultyId = new ObjectId(patch.facultyId);
  if (patch.programYearId) setPatch.programYearId = new ObjectId(patch.programYearId);
  if (patch.groupCohortId) setPatch.groupCohortId = new ObjectId(patch.groupCohortId);
  if ("semigroupCohortId" in patch) {
    setPatch.semigroupCohortId = patch.semigroupCohortId ? new ObjectId(patch.semigroupCohortId) : null;
  }
  const opts: FindOneAndUpdateOptions = { returnDocument: "after" };
  const updated: WithId<UserDoc> | null = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: setPatch },
    opts
  );
  return updated ? mapToDto(updated) : null;
}

export async function deleteById(id: string): Promise<boolean> {
  const col = await getCollection();
  const { deletedCount } = await col.deleteOne({ _id: new ObjectId(id) });
  return deletedCount === 1;
}
