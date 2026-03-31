import { AuthOkResponseT, MeResponseT } from "../schemas/auth.zod";
import { UserRoleT } from "../schemas/common.zod";
import { userToAuthMeDto } from "./users.mapper";

export function toAuthOkBasic(
  user: { id: string; email: string; role: UserRoleT },
  xsrfToken: string
): AuthOkResponseT {
  return {
    ok: true,
    xsrfToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: null,
      familyName: null,
      preferredLanguage: null,
      preferredTheme: null,
      facultyId: null,
      programId: null,
      programYearId: null,
      groupCohortId: null,
      semigroupCohortId: null,
    },
  };
}

export function toAuthOkMe(user: ReturnType<typeof userToAuthMeDto>): MeResponseT {
  return { ok: true, user };
}
