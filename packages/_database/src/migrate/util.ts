import { MongoClient } from 'mongodb'

export const createDatabase =
  (mgmtMongo: MongoClient) => async (dbName: string) => {
    await mgmtMongo.connect()
    await mgmtMongo.db(dbName).createCollection('__touch')
  }

export const dropDatabase =
  (mgmtMongo: MongoClient) => async (dbName: string) => {
    await mgmtMongo.db(dbName).dropDatabase()
  }
