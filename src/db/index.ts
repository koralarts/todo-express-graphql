import { MongoClient, Collection } from "mongodb";

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
        await db.createCollection('users', {
          validator: {
            bsonType: 'object',
            required: ['_id', 'email', 'username', 'password'],
            _id: {
              bsonType: 'string',
              description: 'must be string and required'
            },
            email: {
              bsonType: 'string',
              pattern: '^.+@.+\.[\w]+$',
              description: 'must be string and required'
            },
            name: {
              bsonType: 'string',
              description: 'must be string and required'
            },
            password: {
              bsonType: 'string',
              description: 'must be string and required'
            }
          }
        });
        console.log('Collection created: users');
      } catch (e) {
        if (e.codeName === 'NamespaceExists') {
          console.log('Users collections already exists.')
        } else {
          console.log('[ERROR] Creating users collection', e);
        }
      }

      try {
        await db.createCollection('tasks', {
          validator: {
            bsonType: 'object',
            required: ['_id', 'user', 'description', 'updatedOn', 'createdOn'],
            _id: {
              bsonType: 'string',
              description: 'must be string and required'
            },
            name: {
              bsonType: 'string',
              description: 'must be string and required'
            },
            description: {
              bsonType: 'string',
              description: 'must be string and required'
            },
            user: {
              bsonType: 'string',
              description: 'must be string and required'
            },
            completed: {
              bsonType: 'boolean',
              description: 'must be boolean'
            },
            dateCompleted: {
              bsonType: 'int',
              description: 'must be int'
            },
            deadline: {
              bsonType: 'int',
              description: 'must be int'
            },
            updatedOn: {
              bsonType: 'int',
              description: 'must be int'
            },
            createdOn: {
              bsonType: 'int',
              description: 'must be int'
            }
          }
        });
        console.log('Collection created: tasks');
      } catch (e) {
        if (e.codeName === 'NamespaceExists') {
          console.log('Tasks collections already exists.')
        } else {
          console.log('[ERROR] Creating tasks collection', e);
        }
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
