import { MongoClient, WithTransactionCallback } from 'mongodb'
import { MgmtEnv } from '../env/mgmt-env'

const mongoTransaction =
  (mgmtEnv: MgmtEnv) =>
  async <T = void>(mongo: MongoClient, queries: WithTransactionCallback<T>) => {
    const session = mongo.startSession()
    const result = mgmtEnv.MONGO_USE_RS
      ? await session.withTransaction(queries)
      : await queries(session)
    await session.endSession()
    return result
  }

export default mongoTransaction
