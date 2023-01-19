import { MongoClient } from 'mongodb'
import { MgmtEnv } from './env/mgmt-env'

export type DbEnv = Pick<MgmtEnv, 'MONGO_URI'>

export const createMongo = (env: DbEnv) => {
  const mongo = new MongoClient(env.MONGO_URI)
  return mongo
}
