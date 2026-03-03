import type { ObjectId } from "mongodb";

export type RefreshTokenDbBase = {
  userId: ObjectId;
  jti: string;
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
  ip?: string | null;
  userAgent?: string | null;
};

export type RefreshTokenDbDoc = RefreshTokenDbBase & { _id: ObjectId };
export type RefreshTokenDbRecord = RefreshTokenDbBase;
