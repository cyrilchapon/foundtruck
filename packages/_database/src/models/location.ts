import { Schema, Types } from 'mongoose'
import type GeoJSON from 'geojson'
import { pointSchema } from './geojson'
import { DayMeal, dayMealSchema } from './day-meal'

export type Location = {
  _id: Types.ObjectId
  name: string
  point: GeoJSON.Point
  dayMeals: DayMeal[]
}

export const locationSchema = new Schema<Location>({
  // _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  point: { type: pointSchema, required: true },
  dayMeals: { type: [dayMealSchema], required: true },
})
