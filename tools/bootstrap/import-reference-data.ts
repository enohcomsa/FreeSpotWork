import 'dotenv/config';

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import util from 'node:util';

import { EJSON } from 'bson';
import { MongoClient } from 'mongodb';

import { referenceCollections } from './collections';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Missing MONGODB_URI');
}

const dbName = process.env.MONGODB_DB;
if (!dbName) {
  throw new Error('Missing MONGODB_DB');
}

const inputDir = join(__dirname, 'reference-data');

async function main() {
  const client = new MongoClient(uri);

  await client.connect();

  try {
    const db = client.db(dbName);

    for (const collectionName of referenceCollections) {
      console.log(`Importing ${collectionName}...`);

      const json = await readFile(
        join(inputDir, `${collectionName}.json`),
        'utf8',
      );

      const documents = EJSON.parse(json);

      if (documents.length > 0) {
        await db.collection(collectionName).insertMany(documents);
      }

      console.log(
        `✓ Imported ${collectionName} (${documents.length} documents)`,
      );
    }

    console.log(`\n✅ Reference data imported into ${dbName}`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(util.inspect(error, { depth: null, colors: true }));
  process.exit(1);
});
