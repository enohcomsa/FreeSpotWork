import 'dotenv/config';
import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI missing');

const provider: 'local' | 'atlas' = (() => {
  if (uri.startsWith('mongodb://')) {
    return 'local';
  }

  if (uri.startsWith('mongodb+srv://')) {
    return 'atlas';
  }

  throw new Error('Unsupported MongoDB URI scheme.');
})();

const dbName = process.env.MONGODB_DB;

export async function connectToDatabase(): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri as string);
    await client.connect();
    db = dbName ? client.db(dbName) : client.db();

    console.log(`[startup] env=${process.env.APP_ENV} provider=${provider} db=${db.databaseName}`,);
  }
  return db as Db;
}

export function getClient(): MongoClient {
  if (!client) throw new Error('Mongo client not initialized');
  return client;
}
