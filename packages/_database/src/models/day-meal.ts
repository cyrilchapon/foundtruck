import { Schema } from 'mongoose'

export const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const
export type Day = (typeof days)[number]

export const meals = ['break', 'launch', 'dinner'] as const
export type Meal = (typeof meals)[number]

export type DayMeal = {
  day: Day
  meal: Meal
}

export const dayMealSchema = new Schema(
  {
    day: {
      type: String,
      enum: days,
      required: true,
    },
    meal: {
      type: String,
      enum: meals,
    },
  },
  { _id: false },
)
