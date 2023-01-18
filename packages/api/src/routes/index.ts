import express from 'express'
import { Knex } from 'knex'
import { createFoodtruckHandler } from './foodtruck'
import { createLocationHandler } from './location'
import { createTileHandler } from './tile'

const createRouter = (knex: Knex) => {
  const router = express.Router()

  router.use('/foodtrucks', createFoodtruckHandler(knex))
  router.use('/locations', createLocationHandler(knex))
  router.use('/tiles', createTileHandler(knex))

  return router
}

export { createRouter }
