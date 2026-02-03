import { MongoClient, Db, Collection, Document } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let client: MongoClient | null = null;
let db: Db | null = null;
let memoryServer: MongoMemoryServer | null = null;

const DB_NAME = 'accounts_db';

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(DB_NAME);

  return db;
};

export const getDatabase = (): Db => {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase first.');
  }
  return db;
};

export const getCollection = <T extends Document>(name: string): Collection<T> => {
  const database = getDatabase();
  return database.collection<T>(name);
};

export const closeConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
