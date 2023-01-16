import { createLogger } from '@chimanos/foundtruck-common'
import { appEnv } from './env/app-env'

export const logger = createLogger('api', appEnv.LOG_LEVEL)
