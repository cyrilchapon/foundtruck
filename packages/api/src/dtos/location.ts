import { Location } from '@chimanos/foundtruck-db'
import { z } from 'zod'
import { dayMealZ } from './day-meal'
import { pointZ } from './geojson'
import { FlattenId } from './object-id'

type _SerializedLocation = FlattenId<Location, '_id' | 'foodtruck'>

export const locationZ = z
  .object({
    _id: z.string(),
    name: z.string(),
    point: pointZ,
    dayMeals: z.array(dayMealZ),
    foodtruck: z.string(),
  })
  .strict() satisfies z.ZodType<_SerializedLocation>

export type SerializedLocation = z.infer<typeof locationZ>
