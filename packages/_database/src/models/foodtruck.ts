import { Feature, Point } from 'geojson'
import { Model, Schema, Types } from 'mongoose'
import { Location, locationSchema } from './location'

export type Foodtruck = {
  _id: Types.ObjectId
  name: string
  location: Location
}

type FoodtruckDocumentOverrides = {
  names: Types.Subdocument<Types.ObjectId> & Foodtruck
}

export const foodtruckSchema = new Schema<Foodtruck>({
  // _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  location: locationSchema,
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
        $project: {
          _id: 0,
          type: { $literal: 'Feature' },
          properties: {
            _id: '$_id',
            name: '$name',
          },
          geometry: '$location.point',
        },
      },
    ])
  }
