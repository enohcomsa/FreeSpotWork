import {
  AuthOkResponseDTO,
  LoginRequestDTO,
  MeResponseDTO,
  RefreshResponseDTO,
  SignupRequestDTO,
} from '@free-spot/api-client';
import {
  AuthOk,
  LoginCmd,
  RefreshSessionResult,
  SignupCmd,
} from '@free-spot-domain/auth';
import { User } from '@free-spot-domain/user';
import { authDtoToDomain } from '@http-free-spot/user';


export function toLoginDTO(input: LoginCmd): LoginRequestDTO {
  return {
    identifier: input.identifier,
    password: input.password,
  };
}

export function toSignupDTO(input: SignupCmd): SignupRequestDTO {
  return {
    email: input.email,
    password: input.password,
    username: input.username,
  };
}

export function authOkDtoToDomain(dto: AuthOkResponseDTO): AuthOk {
  return {
    xsrfToken: dto.xsrfToken ?? null,
  };
}

export function refreshDtoToDomain(dto: RefreshResponseDTO): RefreshSessionResult {
  return {
    xsrfToken: dto.xsrfToken ?? null,
  };
}

export function meDtoToDomain(dto: MeResponseDTO): User {
  if (!dto.ok || !dto.user?.id || !dto.user.email || !dto.user.role) {
    throw new Error('Invalid MeResponseDTO');
  }

  return authDtoToDomain(dto.user);
}
