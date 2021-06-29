import { Db, MongoClientOptions, Collection } from 'mongodb'

export type DatabaseService = {
  db?: Db | null;
  config: (connectionString?: string, dbName?: string, connectionOpts?: MongoClientOptions) => void;
  use: <TSchema>(collectionName: string) => Collection<TSchema>;
}
