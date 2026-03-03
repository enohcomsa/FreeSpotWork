import type { RefreshTokenDbDoc, RefreshTokenDbRecord } from "../db/types";
import { getCollection, toObjectId } from "../utils/mongo";

const REFRESH_TOKENS_COLLECTION = "refresh_tokens";

export async function createRefreshToken(record: RefreshTokenDbRecord): Promise<void> {
  const collection = await getCollection<RefreshTokenDbRecord>(REFRESH_TOKENS_COLLECTION);
  await collection.insertOne(record);
}

export async function findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenDbDoc | null> {
  const collection = await getCollection<RefreshTokenDbDoc>(REFRESH_TOKENS_COLLECTION);
  return collection.findOne({ tokenHash });
}

export async function revokeRefreshTokenByHash(tokenHash: string): Promise<boolean> {
  const collection = await getCollection<RefreshTokenDbDoc>(REFRESH_TOKENS_COLLECTION);

  const res = await collection.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );

  return res.modifiedCount === 1;
}

export async function revokeAllUserRefreshTokens(userId: string): Promise<number> {
  const collection = await getCollection<RefreshTokenDbDoc>(REFRESH_TOKENS_COLLECTION);
  const res = await collection.updateMany(
    { userId: toObjectId(userId), revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
  return res.modifiedCount;
}
