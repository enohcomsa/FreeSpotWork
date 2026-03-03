import type { UserCreateRequest, UserUpdateRequest, UserResponseDto } from "../schemas/users.zod";
import * as repo from "../repos/users.repo";
import { NotFoundError } from "./errors";
import { mapMongoError } from "./mongo";

export async function getUsers(): Promise<UserResponseDto[]> {
  return repo.listUsers();
}

export async function getUser(id: string): Promise<UserResponseDto> {
  const res = await repo.getUserById(id);
  if (!res) throw new NotFoundError("User not found");
  return res;
}

export async function createUser(
  input: UserCreateRequest,
  passwordHash: string
): Promise<UserResponseDto> {
  try {
    return await repo.createUser(input, passwordHash);
  } catch (e) {
    mapMongoError(e);
  }
}

export async function updateUser(id: string, patch: UserUpdateRequest): Promise<UserResponseDto> {
  try {
    const res = await repo.updateUserById(id, patch);
    if (!res) throw new NotFoundError("User not found");
    return res;
  } catch (e) {
    mapMongoError(e);
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const ok = await repo.deleteUserById(id);
    if (!ok) throw new NotFoundError("User not found");
    return ok;
  } catch (e) {
    mapMongoError(e);
  }
}
