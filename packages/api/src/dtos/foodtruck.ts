import { Foodtruck } from '@chimanos/foundtruck-db'
import { z } from 'zod'
import { FlattenId } from './object-id'

type _SerializedFoodtruck = FlattenId<Foodtruck>

export const foodtruckZ = z
  .object({
    _id: z.string(),
    name: z.string(),
  })
  .strict() satisfies z.ZodType<_SerializedFoodtruck>

export type SerializedFoodtruck = z.infer<typeof foodtruckZ>
