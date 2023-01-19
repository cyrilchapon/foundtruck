import { Connection, Mongoose } from 'mongoose'
import { Foodtruck, FoodtruckModel, foodtruckSchema } from './foodtruck'

export const createModels = (mongoose: Connection | Mongoose) => {
  const foodtruck = mongoose.model<Foodtruck, FoodtruckModel>(
    'Foodtruck',
    foodtruckSchema,
  )

  return {
    foodtruck,
  }
}

export type Models = ReturnType<typeof createModels>

export * from './foodtruck'
export * from './location'
