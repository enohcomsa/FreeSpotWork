import { Role } from '@free-spot/core/domain';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  familyName: string | null;
  role: Role;
}
