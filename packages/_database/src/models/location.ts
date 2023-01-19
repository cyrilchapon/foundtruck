import { Schema, Types } from 'mongoose'
import type GeoJSON from 'geojson'
import { pointSchema } from './geojson'

export type Location = {
  _id: Types.ObjectId
  name: string
  point: GeoJSON.Point
}

export const locationSchema = new Schema<Location>({
  // _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  point: { type: pointSchema, required: true },
})
