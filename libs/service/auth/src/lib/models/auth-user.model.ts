import { UserPublicDTORoleEnum } from '@free-spot/api-client';

export interface AuthUser {
  id: string;
  email: string;
  role: UserPublicDTORoleEnum;
}
