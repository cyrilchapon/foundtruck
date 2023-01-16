import express from 'express'
import { listHandler } from './list'
import { Knex } from 'knex'

const createLocationHandler = (knex: Knex) => {
  const router = express.Router()

  router.get('/', ...listHandler(knex))

  return router
}

export { createLocationHandler }
