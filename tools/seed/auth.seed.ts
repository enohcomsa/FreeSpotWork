import { SeedContext } from './context';
import { E2E_STUDENT } from './auth.fixtures';
import { hashPassword } from '../../apps/freespot-backend/src/utils/password';
import * as usersRepo from '../../apps/freespot-backend/src/repos/users.repo';

export async function seedAuth(_context: SeedContext): Promise<void> {
  const passwordHash = await hashPassword(E2E_STUDENT.password);

  await usersRepo.createUser(
    {
      email: E2E_STUDENT.email,
      username: E2E_STUDENT.username,
      password: E2E_STUDENT.password,
    },
    passwordHash,
  );

  console.log(`✓ Seeded user '${E2E_STUDENT.email}'`);
}
