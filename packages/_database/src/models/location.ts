import { Model, Schema, Types } from 'mongoose'
import type GeoJSON from 'geojson'
import { pointSchema } from './geojson'
import { DayMeal, dayMealSchema } from './day-meal'
import { Feature, Point } from 'geojson'
import { foodtruckCollectionName } from './foodtruck'

export type Location = {
  _id: Types.ObjectId
  name: string
  point: GeoJSON.Point
  dayMeals: DayMeal[]
  foodtruck: Types.ObjectId
}

export const locationSchema = new Schema<Location>({
  // _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  point: { type: pointSchema, required: true },
  dayMeals: { type: [dayMealSchema], required: true },
  foodtruck: { type: Schema.Types.ObjectId, ref: 'Foodtruck' },
})

export type LocationModel = Model<
  Location,
  Record<string, never>,
  Record<string, never>
>

export const locationModelName = 'Location'
export const locationCollectionName = 'locations'

export const findAsGeoJSONFeatures =
  (locationModel: LocationModel) => async () => {
    return locationModel.aggregate<Feature<Point>>([
      {
        $lookup: {
          from: foodtruckCollectionName,
          localField: 'foodtruck',
          foreignField: '_id',
          as: 'foodtruck2',
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          type: { $literal: 'Feature' },
          properties: {
            // foodtruck: {
            //   _id: { $toString: '$_id' },
            //   name: '$name',
            // },
            location: {
              _id: { $toString: '$_id' },
              name: '$name',
              dayMeals: '$dayMeals',
            },
          },
          geometry: '$point',
        },
      },
    ])
  }
