import { Models } from '@chimanos/foundtruck-db'
import express from 'express'
import { Mongoose } from 'mongoose'
import { GeoJSONVT } from '../tiles'
import { createFoodtruckHandler } from './foodtruck'
import { createTileHandler } from './tile'

const createRouter = (
  mongoose: Mongoose,
  models: Models,
  tileIndex: GeoJSONVT,
) => {
  const router = express.Router()

  router.use('/foodtrucks', createFoodtruckHandler(mongoose, models))
  router.use('/tiles', createTileHandler(mongoose, models, tileIndex))

  return router
}

export { createRouter }
