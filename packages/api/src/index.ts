import { appEnv } from './env/app-env'
import { createKnex, ensureConnection } from '@chimanos/foundtruck-db'
import express from 'express'
import http from 'http'

import { createRouter } from './routes'
import { logger } from './log'

const app = express()
const server = http.createServer(app)

const knex = createKnex(appEnv)

app.use(express.json())
if (appEnv.NODE_ENV === 'development') {
  app.set('json spaces', 2)
}

const go = async () => {
  try {
    await ensureConnection(knex)

    app.use('/', createRouter(knex))

    server.listen(appEnv.PORT, () =>
      logger.info(`Magic happens on port ${appEnv.PORT}`),
    )
    await new Promise((resolve, reject) => {
      server.on('close', resolve)
      server.on('error', reject)
    })
  } finally {
    await knex.destroy().catch(logger.error)
  }
}

void go().then().catch(logger.error)