import express from 'express'
import { renderHandler } from './render'
import { Mongoose } from 'mongoose'
import { Models } from '@chimanos/foundtruck-db'
import { GeoJSONVT } from '../../tiles'

const createTileHandler = (
  mongoose: Mongoose,
  models: Models,
  tileIndex: GeoJSONVT,
) => {
  const router = express.Router()

  router.get('/:z/:x/:y.pbf', ...renderHandler(mongoose, models, tileIndex))

  return router
}

export { createTileHandler }
