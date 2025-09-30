import 'dotenv/config';
import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error('MONGODB_URI missing');

const dbName = process.env.MONGODB_DB;

export async function connectToDatabase(): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = dbName ? client.db(dbName) : client.db();

    console.log(`[db] Connected to MongoDB — db=${db.databaseName}`);
  }
  return db;
}

export function getClient(): MongoClient {
  if (!client) throw new Error('Mongo client not initialized');
  return client;
}
