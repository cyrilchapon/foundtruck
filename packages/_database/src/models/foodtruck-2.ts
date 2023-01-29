import { Feature, Point } from 'geojson'
import { Model, Schema, Types } from 'mongoose'
import { Location2, location2Schema } from './location-2'

export type Foodtruck2 = {
  _id: Types.ObjectId
  name: string
  location: Location2
}

type Foodtruck2DocumentOverrides = {
  names: Types.Subdocument<Types.ObjectId> & Foodtruck2
}

export const foodtruck2Schema = new Schema<Foodtruck2>({
  // _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  location: location2Schema,
})

export type Foodtruck2Model = Model<
  Foodtruck2,
  Record<string, never>,
  Foodtruck2DocumentOverrides
>

export const findAsGeoJSONFeatures2 =
  (foodtruck2Model: Foodtruck2Model) => async () => {
    return foodtruck2Model.aggregate<Feature<Point>>([
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
