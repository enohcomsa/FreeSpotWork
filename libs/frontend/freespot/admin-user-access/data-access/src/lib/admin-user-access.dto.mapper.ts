import { type UserResponseDTO, type UserRoleDTO } from '@free-spot/api-client';
import { type Role } from '@free-spot/core/domain';
import { type AdminUser } from '@free-spot/admin-user-access/domain';

export function dtoToAdminUser(dto: UserResponseDTO): AdminUser {
  if (!dto.id) {
    throw new Error('User id is required');
  }

  return {
    id: dto.id,
    email: dto.email ?? '',
    firstName: dto.firstName ?? null,
    familyName: dto.familyName ?? null,
    role: toRole(dto.role),
  };
}

export function roleToDto(role: Role): UserRoleDTO {
  return role as UserRoleDTO;
}

function toRole(role: UserRoleDTO | undefined): Role {
  if (!role) {
    throw new Error('Missing user role');
  }

  return role as Role;
}
