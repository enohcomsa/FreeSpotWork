import type { RefreshTokenBaseT } from "../schemas/refresh-tokens.zod";
import type { RefreshTokenDbRecord } from "../db/types/refresh-tokens.db";
import { toObjectId } from "../utils/mongo";

export function refreshTokenToDbRecord(input: RefreshTokenBaseT): RefreshTokenDbRecord {
  return {
    userId: toObjectId(input.userId),
    jti: input.jti,
    tokenHash: input.tokenHash,
    createdAt: new Date(input.createdAt),
    expiresAt: new Date(input.expiresAt),

    revokedAt: input.revokedAt ? new Date(input.revokedAt) : null,
    ip: input.ip ?? null,
    userAgent: input.userAgent ?? null,
  };
}
