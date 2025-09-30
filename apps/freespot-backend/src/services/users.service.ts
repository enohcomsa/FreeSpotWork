import type { UserCreateInput, UserUpdateInput, UserResponseDto } from "../schemas/users.zod";
import * as repo from "../repos/users.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getUser(id: string): Promise<UserResponseDto> {
  const res = await repo.findById(id);
  if (!res) throw new NotFoundError("User not found");
  return res;
}

export async function createUser(input: UserCreateInput): Promise<UserResponseDto> {
  try {
    return await repo.insertOne(input);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateUser(id: string, patch: UserUpdateInput): Promise<UserResponseDto> {
  try {
    const res = await repo.updateById(id, patch);
    if (!res) throw new NotFoundError("User not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteById(id);
    if (!ok) throw new NotFoundError("User not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
