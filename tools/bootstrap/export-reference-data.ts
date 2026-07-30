import 'dotenv/config';

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

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

const outputDir = join(__dirname, 'reference-data');

async function main() {
  const client = new MongoClient(uri);

  await client.connect();

  try {
    const db = client.db(dbName);

    await mkdir(outputDir, { recursive: true });

    for (const collectionName of referenceCollections) {
      const documents = await db
        .collection(collectionName)
        .find({})
        .toArray();

      await writeFile(
        join(outputDir, `${collectionName}.json`),
        EJSON.stringify(documents, undefined, 2, { relaxed: false }),
        'utf8',
      );

      console.log(
        `✓ Exported ${collectionName} (${documents.length} documents)`,
      );
    }

    console.log(`\n✅ Reference data exported to:\n${outputDir}`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
