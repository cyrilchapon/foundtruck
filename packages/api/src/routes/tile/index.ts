import express from 'express'
import { renderHandler } from './render'
import { Knex } from 'knex'

const createTileHandler = (knex: Knex) => {
  const router = express.Router()

  router.get('/:z/:x/:y.pbf', ...renderHandler(knex))

  return router
}

export { createTileHandler }
