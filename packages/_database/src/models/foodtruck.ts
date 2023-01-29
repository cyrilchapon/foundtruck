import { Feature, Point } from 'geojson'
import { Model, Schema, Types } from 'mongoose'
import { DayMeal } from './day-meal'
import { Location, locationSchema } from './location'

export type Foodtruck = {
  _id: Types.ObjectId
  name: string
  locations: Location[]
}

type FoodtruckDocumentOverrides = {
  locations: Types.DocumentArray<
    Omit<Location, 'point' | 'dayMeals'> & {
      // dayMeals: Types.DocumentArray<DayMeal>
      dayMeals: Types.Array<Types.Subdocument<never> & DayMeal>
      point: Types.Subdocument<never> & Point
    }
  >
}

export const foodtruckSchema = new Schema<Foodtruck>({
  // _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  locations: { type: [locationSchema], required: true },
})

export type FoodtruckModel = Model<
  Foodtruck,
  Record<string, never>,
  FoodtruckDocumentOverrides
>

export const findAsGeoJSONFeatures =
  (foodtruckModel: FoodtruckModel) => async () => {
    return foodtruckModel.aggregate<Feature<Point>>([
      {
        $unwind: {
          path: '$locations',
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$locations._id' },
          type: { $literal: 'Feature' },
          properties: {
            foodtruck: {
              _id: { $toString: '$_id' },
              name: '$name',
            },
            location: {
              _id: { $toString: '$locations._id' },
              name: '$locations.name',
              dayMeals: '$locations.dayMeals',
            },
          },
          geometry: '$locations.point',
        },
      },
    ])
  }
