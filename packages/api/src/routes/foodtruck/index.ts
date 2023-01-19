import express from 'express'
import { listHandler } from './list'
import { Mongoose } from 'mongoose'
import { Models } from '@chimanos/foundtruck-db'

const createFoodtruckHandler = (mongoose: Mongoose, models: Models) => {
  const router = express.Router()

  router.get('/', ...listHandler(mongoose, models))

  return router
}

export { createFoodtruckHandler }
