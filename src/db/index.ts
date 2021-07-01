import { MongoClient, Db } from "mongodb";

import { DatabaseService } from "../types/db";

const MONGO_CONNECTION_STRING = "mongodb://localhost:27017";
const MONGO_DB_NAME = "todo-api";

const DbService: DatabaseService = {
  db: null,
  async config(connectionString = MONGO_CONNECTION_STRING, dbName = MONGO_DB_NAME, connectionOpts = {}) {
    if (this.db) {
      return;
    }

    try {
      const client = await MongoClient.connect(connectionString, { useNewUrlParser: true });
      const db = client.db(MONGO_DB_NAME);

      console.log(`Connected to: ${connectionString}`);
      console.log(`Databse: ${MONGO_DB_NAME}`);

      try {
        await db.createCollection('users');
        console.log('Collection created: users');
      } catch (e) {
        console.log('Collection already exists: users');
      }

      try {
        await db.createCollection('tasks');
        console.log('Collection created: tasks');
      } catch (e) {
        console.log('Collection already exists: tasks');
      }

      this.db = db;
    } catch (e) {
      throw new Error(e);
    }
  },
  use(collectionName) {
    if (!this.db) {
      throw Error('[ERROR] Database is not initialized.');
    }

    return this.db.collection(collectionName);
  }
}

Object.seal(DbService);
export default DbService;
