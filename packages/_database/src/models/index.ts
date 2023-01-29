import { Connection, Mongoose } from 'mongoose'
import { Foodtruck, FoodtruckModel, foodtruckSchema } from './foodtruck'
import { Foodtruck2, Foodtruck2Model, foodtruck2Schema } from './foodtruck-2'

export const createModels = (mongoose: Connection | Mongoose) => {
  const foodtruck = mongoose.model<Foodtruck, FoodtruckModel>(
    'Foodtruck',
    foodtruckSchema,
    'foodtrucks',
  )
  const foodtruck2 = mongoose.model<Foodtruck2, Foodtruck2Model>(
    'Foodtruck2',
    foodtruck2Schema,
    'foodtrucks2',
  )

  return {
    foodtruck,
    foodtruck2,
  }
}

export type Models = ReturnType<typeof createModels>

export * from './foodtruck'
export * from './location'
export * from './foodtruck-2'
export * from './location-2'
export * from './day-meal'
