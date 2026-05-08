import { type UserResponseDTO, UserRoleDTO } from '@free-spot/api-client';
import { Role } from '@free-spot/core/domain';
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
    role: dtoToRole(dto.role),
  };
}

function dtoToRole(role: UserRoleDTO): Role {
  switch (role) {
    case UserRoleDTO.ADMIN:
      return Role.ADMIN;
    case UserRoleDTO.MEMBER:
      return Role.MEMBER;
    default:
      throw new Error('Invalid user role');
  }
}

export function roleToDto(role: Role): UserRoleDTO {
  switch (role) {
    case Role.ADMIN:
      return UserRoleDTO.ADMIN;
    case Role.MEMBER:
      return UserRoleDTO.MEMBER;
    default:
      throw new Error('Invalid user role');
  }
}
