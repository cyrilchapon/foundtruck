import {
  CleanedEnv,
  knownNodeEnv,
  KnownNodeEnv,
  LogLevel,
  logLevelValidator,
} from '@chimanos/foundtruck-common'
import * as envalid from 'envalid'

interface MgmtEnv {
  NODE_ENV: KnownNodeEnv
  LOG_LEVEL: LogLevel
  MONGO_URI: string
  MONGO_MGMT_URI: string
  MONGO_MGMT_DB_NAME: string
  MONGO_USE_RS: boolean
}

const mgmtEnvValidators = {
  NODE_ENV: envalid.str({ choices: knownNodeEnv }),
  LOG_LEVEL: logLevelValidator(),
  MONGO_URI: envalid.str(),
  MONGO_MGMT_URI: envalid.str(),
  MONGO_MGMT_DB_NAME: envalid.str(),
  MONGO_USE_RS: envalid.bool(),
}

const getMgmtEnv = (env: NodeJS.ProcessEnv = process.env) => {
  const cleanedEnv = envalid.cleanEnv<MgmtEnv>(env, mgmtEnvValidators)

  return { ...cleanedEnv } as CleanedEnv<MgmtEnv>
}

const mgmtEnv = getMgmtEnv(process.env)

export { mgmtEnv, getMgmtEnv }
export type { MgmtEnv }
