import { Connection, Mongoose } from 'mongoose'
import {
  Foodtruck,
  foodtruckCollectionName,
  FoodtruckModel,
  foodtruckModelName,
  foodtruckSchema,
} from './foodtruck'
import {
  Location,
  locationCollectionName,
  LocationModel,
  locationModelName,
  locationSchema,
} from './location'

export const createModels = (mongoose: Connection | Mongoose) => {
  const foodtruck = mongoose.model<Foodtruck, FoodtruckModel>(
    foodtruckModelName,
    foodtruckSchema,
    foodtruckCollectionName,
  )

  const location = mongoose.model<Location, LocationModel>(
    locationModelName,
    locationSchema,
    locationCollectionName,
  )

  return {
    foodtruck,
    location,
  }
}

export type Models = ReturnType<typeof createModels>

export * from './foodtruck'
export * from './location'
export * from './day-meal'
