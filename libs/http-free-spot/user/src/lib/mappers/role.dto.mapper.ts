import { Role } from "@free-spot-domain/user";
import { UserRoleDTO } from "@free-spot/api-client";

export const dtoToRole = (dto: UserRoleDTO): Role => dto as unknown as Role;
export const roleToDto = (value: Role): UserRoleDTO => value as unknown as UserRoleDTO;
