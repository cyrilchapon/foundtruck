import express from 'express'
import { Knex } from 'knex'
import { createFoodtruckHandler } from './foodtruck'
import { createLocationHandler } from './location'

const createRouter = (knex: Knex) => {
  const router = express.Router()

  router.use('/foodtrucks', createFoodtruckHandler(knex))
  router.use('/locations', createLocationHandler(knex))

  return router
}

export { createRouter }
