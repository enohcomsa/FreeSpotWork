import argon2 from "argon2";

const PEPPER = process.env.PASSWORD_PEPPER ?? "";

/**
 * Append pepper in a deterministic way.
 * Delimiter prevents accidental collisions.
 */
function withPepper(password: string): string {
  return PEPPER ? `${password}::${PEPPER}` : password;
}

/**
 * Hash password using argon2id.
 * Parameters are balanced for web backend usage.
 * Tune later if needed after benchmarking.
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(withPepper(password), {
    type: argon2.argon2id,
    memoryCost: 19_456,   // ~19MB
    timeCost: 2,
    parallelism: 1,
  });
}

/**
 * Verify password against stored PHC hash.
 * argon2.verify already performs constant-time comparison.
 */
export async function verifyPassword(
  phcHash: string,
  password: string
): Promise<boolean> {
  try {
    return await argon2.verify(phcHash, withPepper(password));
  } catch {
    // If hash is malformed or verification fails internally,
    // treat as invalid credentials without leaking info.
    return false;
  }
}
