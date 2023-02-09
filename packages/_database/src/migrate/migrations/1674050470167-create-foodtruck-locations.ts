import { mgmtEnv } from '../../env/mgmt-env'
import _mongoTransaction from '../transaction'
import type { Migration } from '../umzug'

const mongoTransaction = _mongoTransaction(mgmtEnv)

export const up: Migration = async ({ context: { mongo } }) => {
  await mongoTransaction(mongo, async (session) => {
    await mongo.db().createCollection('locations', { session })
    await mongo.db().createCollection('foodtrucks', { session })
  })
}

export const down: Migration = async ({ context: { mongo } }) => {
  await mongoTransaction(mongo, async (session) => {
    await mongo.db().dropCollection('locations', { session })
    await mongo.db().dropCollection('foodtrucks', { session })
  })
}
