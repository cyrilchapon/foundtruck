import { appEnv } from './env/app-env'
import { createModels, createMongoose } from '@chimanos/foundtruck-db'
import express from 'express'
import http from 'http'
import methodOverride from 'method-override'
import cors from 'cors'

import { createRouter } from './routes'
import { logger } from './log'
import { buildTileIndex } from './tiles'

const app = express()
const server = http.createServer(app)

const mongoose = createMongoose()
const models = createModels(mongoose)

app.use(cors({ origin: appEnv.FRONTEND_ORIGIN }))
app.use(express.json())
app.use(methodOverride(undefined, { methods: ['POST'] }))

if (appEnv.NODE_ENV === 'development') {
  app.set('json spaces', 2)
}

const go = async () => {
  try {
    await mongoose.connect(appEnv.MONGO_URI)

    const tileIndex = await buildTileIndex(models)

    app.use('/', createRouter(mongoose, models, tileIndex))

    server.listen(appEnv.PORT, () =>
      logger.info(`Magic happens on port ${appEnv.PORT}`),
    )
    await new Promise((resolve, reject) => {
      server.on('close', resolve)
      server.on('error', reject)
    })
  } finally {
    await mongoose.disconnect().catch(logger.error)
  }
}

void go().then().catch(logger.error)
