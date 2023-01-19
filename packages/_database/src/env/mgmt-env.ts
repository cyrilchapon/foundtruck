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
}

const mgmtEnvValidators = {
  NODE_ENV: envalid.str({ choices: knownNodeEnv }),
  LOG_LEVEL: logLevelValidator(),
  MONGO_URI: envalid.url(),
}

const getMgmtEnv = (env: NodeJS.ProcessEnv = process.env) => {
  const cleanedEnv = envalid.cleanEnv<MgmtEnv>(env, mgmtEnvValidators)

  return { ...cleanedEnv } as CleanedEnv<MgmtEnv>
}

const mgmtEnv = getMgmtEnv(process.env)

export { mgmtEnv, getMgmtEnv }
export type { MgmtEnv }
