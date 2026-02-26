// apps/freespot-backend/src/db/migrate/002-auth-collections.ts
import { Db } from "mongodb";
import { ensureCollection } from "./helpers";
import { usersSpec, refreshTokensSpec } from "../schemas";

export async function run(db: Db) {
  // Updates users validator + indexes (adds auth/security/timestamps fields)
  await ensureCollection(db, usersSpec);

  // Creates refresh_tokens (or updates validator/indexes)
  await ensureCollection(db, refreshTokensSpec);
}
