import { Db, MongoClient } from 'mongodb';

export interface SeedContext {
  client: MongoClient;
  db: Db;
}

export async function createSeedContext(): Promise<SeedContext> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI missing');
  }

  const client = new MongoClient(uri);

  await client.connect();

  const db = process.env.MONGODB_DB
    ? client.db(process.env.MONGODB_DB)
    : client.db();

  return {
    client,
    db,
  };
}

export async function disposeSeedContext(context: SeedContext): Promise<void> {
  await context.client.close();
}
