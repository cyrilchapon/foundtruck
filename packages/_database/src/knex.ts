import Knex from 'knex'
import { MgmtEnv } from './env/mgmt-env'

export type DbEnv = Pick<MgmtEnv, 'DATABASE_URL'>

export const createKnex = (env: DbEnv) => Knex({
  client: 'pg',
  connection: env.DATABASE_URL
})
