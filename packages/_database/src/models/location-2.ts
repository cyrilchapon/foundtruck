import { Schema, Types } from 'mongoose'
import type GeoJSON from 'geojson'
import { pointSchema } from './geojson'

export type Location2 = {
  _id: Types.ObjectId
  name: string
  point: GeoJSON.Point
}

export const location2Schema = new Schema<Location2>({
  // _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  point: { type: pointSchema, required: true },
})
