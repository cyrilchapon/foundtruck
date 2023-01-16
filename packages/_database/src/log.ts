import { createLogger } from '@chimanos/foundtruck-common'
import { mgmtEnv } from './env/mgmt-env'

export const logger = createLogger('database', mgmtEnv.LOG_LEVEL)
