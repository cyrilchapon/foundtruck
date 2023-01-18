import {
  CleanedEnv,
  knownNodeEnv,
  KnownNodeEnv,
  LogLevel,
  logLevelValidator,
} from '@chimanos/foundtruck-common'
import * as envalid from 'envalid'

interface AppEnv {
  NODE_ENV: KnownNodeEnv
  LOG_LEVEL: LogLevel
  PORT: number
  DATABASE_URL: string
  FRONTEND_ORIGIN: string
}

const appEnvValidators = {
  NODE_ENV: envalid.str({ choices: knownNodeEnv }),
  LOG_LEVEL: logLevelValidator(),
  PORT: envalid.port(),
  DATABASE_URL: envalid.url(),
  FRONTEND_ORIGIN: envalid.url()
}

const getAppEnv = (env: NodeJS.ProcessEnv = process.env) => {
  const cleanedEnv = envalid.cleanEnv<AppEnv>(env, appEnvValidators)

  return { ...cleanedEnv } as CleanedEnv<AppEnv>
}

const appEnv = getAppEnv(process.env)

export { appEnv, getAppEnv }
export type { AppEnv }
